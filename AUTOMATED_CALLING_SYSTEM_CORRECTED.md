# 🤖 Automated Candidate Calling System (Corrected)

## 📋 **System Overview**

The automated calling system calls candidates at their scheduled interview times using assigned recruiters (which determine the calling agent type).

## 🗄️ **Database Schema**

### **Updated Candidates Table**
```sql
ALTER TABLE candidates 
ADD COLUMN submitted_to UUID REFERENCES job_postings(id),
ADD COLUMN call_agent UUID REFERENCES recruiters(id);
```

### **Data Flow**
- `submitted_to` is populated when user assigns a job to candidate via "Assign Position"
- `call_agent` is populated when user assigns a recruiter to candidate via "Assign Agent" 
- Both fields reference existing tables (job_postings and recruiters)

## 🔧 **Backend Scheduler Implementation**

### **Main Scheduler Endpoint: `/check-scheduled-calls`**

```javascript
app.get('/check-scheduled-calls', async (req, res) => {
  console.log('🔍 Checking for scheduled calls...');
  
  try {
    const now = new Date();
    const currentTime = now.toISOString();
    const oneMinuteAgo = new Date(now.getTime() - 60000).toISOString();
    
    console.log(`Checking for calls between ${oneMinuteAgo} and ${currentTime}`);
    
    // Get all scheduled screenings that should be called now
    const { data: scheduledCalls, error } = await supabaseAdmin
      .from('candidate_screenings')
      .select(`
        id,
        candidate_id,
        user_id,
        datetime,
        status,
        candidates!inner(
          name,
          phone,
          position,
          call_agent,
          submitted_to,
          job_postings(title, description),
          recruiters(id, name, agent_type)
        )
      `)
      .eq('status', 'scheduled')
      .gte('datetime', oneMinuteAgo)
      .lte('datetime', currentTime)
      .not('candidates.call_agent', 'is', null)
      .not('candidates.submitted_to', 'is', null);
    
    if (error) {
      console.error('Error fetching scheduled calls:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    
    console.log(`Found ${scheduledCalls?.length || 0} calls to make`);
    
    if (!scheduledCalls || scheduledCalls.length === 0) {
      return res.json({ 
        message: 'No calls scheduled for this time',
        calls_checked: 0 
      });
    }
    
    const callResults = [];
    
    // Process each scheduled call
    for (const call of scheduledCalls) {
      const candidate = call.candidates;
      const recruiter = candidate.recruiters;
      
      console.log(`Processing call for candidate: ${candidate.name} (${candidate.phone})`);
      console.log(`Assigned recruiter: ${recruiter.name} (${recruiter.agent_type})`);
      
      // Validate required data
      if (!candidate.phone || !recruiter) {
        console.warn(`Skipping candidate ${candidate.name}: missing phone or recruiter assignment`);
        callResults.push({
          candidate_name: candidate.name,
          status: 'skipped',
          reason: 'Missing phone number or recruiter assignment'
        });
        continue;
      }
      
      try {
        // Make the call based on recruiter's agent type
        const callResult = await initiateCall(call, recruiter);
        callResults.push(callResult);
        
        // Update screening status to indicate call was initiated
        await updateScreeningStatus(call.id, 'in_progress', `Call initiated via ${recruiter.agent_type} (${recruiter.name})`);
        
      } catch (callError) {
        console.error(`Error initiating call for ${candidate.name}:`, callError);
        callResults.push({
          candidate_name: candidate.name,
          status: 'failed',
          reason: callError.message
        });
      }
    }
    
    res.json({
      message: `Processed ${callResults.length} scheduled calls`,
      calls: callResults,
      timestamp: currentTime
    });
    
  } catch (error) {
    console.error('Error in check-scheduled-calls:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Helper function to initiate calls
async function initiateCall(scheduledCall, recruiter) {
  const candidate = scheduledCall.candidates;
  const jobTitle = candidate.job_postings?.title || candidate.position || 'Position';
  
  console.log(`Initiating ${recruiter.agent_type} call to ${candidate.name} at ${candidate.phone} via recruiter ${recruiter.name}`);
  
  // Determine agent type based on recruiter configuration
  // You can store agent_type in recruiters table or determine it by recruiter name/id
  if (recruiter.agent_type === 'bland' || recruiter.name.toLowerCase().includes('bland')) {
    return await initiateBlandCall(candidate, jobTitle, scheduledCall, recruiter);
  } else if (recruiter.agent_type === 'elevenlabs' || recruiter.name.toLowerCase().includes('eleven')) {
    return await initiateElevenLabsCall(candidate, jobTitle, scheduledCall, recruiter);
  } else {
    // Default to your existing /start-call endpoint
    return await initiateDefaultCall(candidate, jobTitle, scheduledCall, recruiter);
  }
}

// Bland AI call initiation
async function initiateBlandCall(candidate, jobTitle, scheduledCall, recruiter) {
  try {
    const blandPayload = {
      phone_number: candidate.phone,
      task: `You are ${recruiter.name} conducting a screening interview for the ${jobTitle} position with ${candidate.name}. Be professional and ask relevant questions about their experience and interest in the role.`,
      voice: 'maya',
      language: 'en',
      model: 'enhanced',
      max_duration: 10, // 10 minutes max
      answered_by_enabled: true,
      wait_for_greeting: true,
      record: true,
      metadata: {
        candidate_id: candidate.id,
        screening_id: scheduledCall.id,
        recruiter_id: recruiter.id,
        job_title: jobTitle,
        scheduled_time: scheduledCall.datetime
      }
    };
    
    // Call your existing /start-call endpoint
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/start-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blandPayload),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Bland AI call initiated successfully:`, data.call_id);
      return {
        candidate_name: candidate.name,
        phone: candidate.phone,
        agent: 'bland',
        recruiter: recruiter.name,
        status: 'initiated',
        call_id: data.call_id,
        job_title: jobTitle
      };
    } else {
      throw new Error(`Bland AI API error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Bland AI call error:', error);
    throw error;
  }
}

// ElevenLabs call initiation
async function initiateElevenLabsCall(candidate, jobTitle, scheduledCall, recruiter) {
  try {
    const elevenLabsPayload = {
      name: candidate.name,
      phone: candidate.phone,
      job_title: jobTitle,
      candidate_id: candidate.id,
      screening_id: scheduledCall.id,
      recruiter_id: recruiter.id,
      recruiter_name: recruiter.name,
      scheduled_time: scheduledCall.datetime
    };
    
    // Call your existing ElevenLabs endpoint
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/elevenlabs/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elevenLabsPayload),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ElevenLabs call initiated successfully:`, data);
      return {
        candidate_name: candidate.name,
        phone: candidate.phone,
        agent: 'elevenlabs',
        recruiter: recruiter.name,
        status: 'initiated',
        call_id: data.call_id || data.id,
        job_title: jobTitle
      };
    } else {
      throw new Error(`ElevenLabs API error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('ElevenLabs call error:', error);
    throw error;
  }
}

// Default call initiation (fallback)
async function initiateDefaultCall(candidate, jobTitle, scheduledCall, recruiter) {
  try {
    const defaultPayload = {
      name: candidate.name,
      phone: candidate.phone,
      job_title: jobTitle,
      candidate_id: candidate.id,
      screening_id: scheduledCall.id,
      recruiter_id: recruiter.id,
      recruiter_name: recruiter.name,
      scheduled_time: scheduledCall.datetime
    };
    
    // Call your existing start-call endpoint as fallback
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/start-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultPayload),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Default call initiated successfully:`, data);
      return {
        candidate_name: candidate.name,
        phone: candidate.phone,
        agent: 'default',
        recruiter: recruiter.name,
        status: 'initiated',
        call_id: data.call_id || data.id,
        job_title: jobTitle
      };
    } else {
      throw new Error(`Default call API error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Default call error:', error);
    throw error;
  }
}

// Update screening status
async function updateScreeningStatus(screeningId, status, notes = null) {
  try {
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    const { error } = await supabaseAdmin
      .from('candidate_screenings')
      .update(updateData)
      .eq('id', screeningId);
    
    if (error) {
      console.error('Error updating screening status:', error);
    } else {
      console.log(`Updated screening ${screeningId} status to: ${status}`);
    }
  } catch (error) {
    console.error('Error updating screening status:', error);
  }
}
```

## 🎯 **How It Works**

1. **User assigns job** → `candidates.submitted_to = job_posting_id`
2. **User assigns recruiter** → `candidates.call_agent = recruiter_id`
3. **Candidate books time** → `candidate_screenings.datetime = scheduled_time`
4. **Scheduler runs** → finds calls where all fields are populated → initiates calls

## 📊 **Required Data Flow**

```
User assigns job via "Assign Position" → candidate.submitted_to = job_id
User assigns recruiter via "Assign Agent" → candidate.call_agent = recruiter_id
Candidate books time → candidate_screenings.datetime = scheduled time

Scheduler runs → finds upcoming calls → looks up recruiter.agent_type → calls appropriate API
```

## 🔍 **Database Query Logic**

The scheduler only processes candidates who have:
- ✅ **Scheduled appointment** (candidate_screenings.status = 'scheduled')
- ✅ **Job assigned** (candidates.submitted_to IS NOT NULL)
- ✅ **Recruiter assigned** (candidates.call_agent IS NOT NULL)
- ✅ **Phone number** (candidates.phone IS NOT NULL)
- ✅ **Time window match** (datetime between now and 1 minute ago)

## 🚨 **Error Handling**

- **Missing assignments**: Skipped with clear logging
- **API failures**: Logged, continues with other calls
- **Database errors**: Returns 500, logs details
- **Invalid recruiter types**: Falls back to default calling method

This system now correctly integrates with your existing assignment infrastructure! 🎯