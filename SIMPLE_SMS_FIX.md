# 📱 Simple SMS Fix - One Backend Endpoint

## 🚨 **Problem**
- ✅ **Logged in**: SMS confirmation works
- ❌ **Logged out**: No SMS sent (RLS blocks candidate data access)

## ✅ **Simple Solution**
Add ONE backend endpoint that handles everything - gets real candidate data and sends SMS.

## 🛠️ **Required Backend Endpoint**

### **POST /send-booking-sms**

```javascript
app.post('/send-booking-sms', async (req, res) => {
  const { candidate_id, user_id, selected_date, selected_time } = req.body;
  
  console.log('Received SMS request:', { candidate_id, user_id, selected_date, selected_time });
  
  try {
    // Get candidate data (candidates table doesn't have user_id column)
    const { data: candidate, error } = await supabaseAdmin
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .single();
    
    if (error || !candidate) {
      console.error('Candidate not found:', error);
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Verify the candidate is associated with the user through job assignments or screenings
    const { data: userAssociation, error: associationError } = await supabaseAdmin
      .from('candidate_job_assignments')
      .select('job_postings!inner(user_id)')
      .eq('candidate_id', candidate_id)
      .single();
    
    // If no job assignment, check if there are existing screenings for this user
    if (associationError || !userAssociation || userAssociation.job_postings.user_id !== user_id) {
      const { data: screening } = await supabaseAdmin
        .from('candidate_screenings')
        .select('user_id')
        .eq('candidate_id', candidate_id)
        .eq('user_id', user_id)
        .single();
      
      if (!screening) {
        console.error('Candidate not associated with this user');
        return res.status(403).json({ error: 'Access denied - candidate not associated with user' });
      }
    }
    
    console.log('Found candidate:', { name: candidate.name, phone: candidate.phone });
    
    // Get job title if available
    let jobTitle = candidate.position || 'Position';
    try {
      const { data: jobData } = await supabaseAdmin
        .from('candidate_job_assignments')
        .select('job_postings!inner(title)')
        .eq('candidate_id', candidate_id)
        .single();
      
      if (jobData?.job_postings?.title) {
        jobTitle = jobData.job_postings.title;
      }
    } catch (jobError) {
      console.log('No specific job assignment found, using position');
    }
    
    // Format datetime for SMS
    const [year, month, day] = selected_date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedDateTime = `${formattedDate} at ${selected_time}`;
    
    // Call your existing /send-confirmation endpoint
    const smsPayload = {
      name: candidate.name,
      phone: candidate.phone,
      job_title: jobTitle,
      datetime: formattedDateTime,
    };
    
    console.log('Sending SMS with payload:', smsPayload);
    
    const smsResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsPayload),
    });
    
    const smsData = await smsResponse.json();
    
    if (smsResponse.ok) {
      console.log('SMS sent successfully');
      res.json({ 
        success: true, 
        message: 'SMS sent successfully',
        candidate_name: candidate.name,
        phone: candidate.phone
      });
    } else {
      console.error('SMS sending failed:', smsData);
      res.status(500).json({ 
        error: 'SMS sending failed', 
        details: smsData 
      });
    }
    
  } catch (error) {
    console.error('Error in send-booking-sms:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 🎯 **How It Works**

**When user is logged in:**
- ✅ Frontend gets candidate data directly
- ✅ Calls `/send-confirmation` directly  
- ✅ SMS sent ✅

**When user is logged out:**
- ❌ Frontend can't get candidate data (RLS blocks)
- ✅ Frontend calls `/send-booking-sms` 
- ✅ Backend gets REAL candidate data using service role
- ✅ Backend calls `/send-confirmation` with real data
- ✅ SMS sent ✅

## 🧪 **Testing**

1. **Test logged in**: Should work as before
2. **Test logged out**: 
   - Book appointment
   - Check console: "Backend SMS sent successfully"  
   - Check phone: SMS received! 📱

## 🚀 **Result**

**Before:** 
- Logged in: SMS ✅
- Logged out: No SMS ❌

**After:**
- Logged in: SMS ✅  
- Logged out: SMS ✅

Just add this one endpoint and SMS will work regardless of login status!