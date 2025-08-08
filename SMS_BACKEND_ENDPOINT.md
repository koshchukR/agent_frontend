# 📱 Fix SMS with Real Phone Number - Backend Endpoint

## 🚨 **Problem**
When users are logged out, RLS blocks database access, so we can't get the real candidate phone number. SMS is being sent to `+000-000-0000` instead of the real phone number.

## ✅ **Solution**
Create a backend endpoint that uses service role access to get real candidate data and send SMS.

## 🛠️ **Required Backend Endpoint**

Add this endpoint to your backend: `https://recruiter-agent-backend-sznn.onrender.com`

### **POST /send-sms-confirmation**

```javascript
app.post('/send-sms-confirmation', async (req, res) => {
  const { candidate_id, user_id, selected_date, selected_time } = req.body;
  
  if (!candidate_id || !user_id || !selected_date || !selected_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Use service role to get real candidate data (bypasses RLS)
    const { data: candidate, error: candidateError } = await supabaseAdmin
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .eq('user_id', user_id) // Security: ensure candidate belongs to user
      .single();
    
    if (candidateError || !candidate) {
      console.error('Candidate not found:', candidateError);
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Validate we have real phone number
    if (!candidate.phone || candidate.phone === '000-000-0000' || candidate.phone === 'phone') {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // Try to get job title from assignments
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
      console.log('No job assignment found, using position');
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
    
    console.log('Sending SMS with real candidate data:', {
      name: candidate.name,
      phone: candidate.phone,
      job_title: jobTitle,
      datetime: formattedDateTime,
    });
    
    // Call your existing SMS endpoint
    const smsResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: candidate.name,
        phone: candidate.phone,
        job_title: jobTitle,
        datetime: formattedDateTime,
      }),
    });
    
    const smsData = await smsResponse.json();
    
    if (smsResponse.ok) {
      console.log('SMS sent successfully via /send-confirmation');
      res.json({ 
        success: true, 
        message: 'SMS sent successfully',
        candidate_name: candidate.name,
        phone_number: candidate.phone 
      });
    } else {
      console.error('SMS sending failed:', smsData);
      res.status(500).json({ 
        error: 'SMS sending failed', 
        details: smsData 
      });
    }
    
  } catch (error) {
    console.error('Error in send-sms-confirmation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 🔒 **Security Features**

- ✅ **User Validation**: Ensures candidate belongs to the specified user
- ✅ **Service Role Access**: Uses admin client to bypass RLS restrictions  
- ✅ **Phone Validation**: Checks for valid phone numbers
- ✅ **Error Handling**: Proper error responses

## 🎯 **How It Works**

1. **Frontend calls** `/send-sms-confirmation` with `candidate_id`, `user_id`, `selected_date`, `selected_time`
2. **Backend fetches real candidate data** using service role (bypasses RLS)
3. **Backend validates** phone number is real (not placeholder)
4. **Backend calls your existing** `/send-confirmation` endpoint with real data
5. **SMS sent to real phone number!** 📱

## 🧪 **Testing Flow**

1. **Log out** of platform
2. **Open calendar link** on different device
3. **Book appointment** 
4. **Check console logs** - should show "Backend SMS sent successfully"
5. **Check phone** - should receive SMS at real number!

## ✅ **Expected Result**

**Before:** SMS sent to `+000-000-0000` ❌
**After:** SMS sent to real candidate phone number ✅

The endpoint ensures that even when the frontend can't access candidate data due to RLS, the backend can still get the real phone number and send SMS confirmations properly.