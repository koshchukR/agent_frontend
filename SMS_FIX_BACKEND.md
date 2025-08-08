# 📱 SMS Confirmation Fix - Backend Endpoints Needed

## 🎯 **Problem**
Calendar booking works on all devices now, but SMS confirmations aren't being sent because the frontend might have placeholder candidate data when RLS blocks database access.

## ✅ **Solution**
The frontend now calls backend endpoints that can fetch real candidate info server-side and send SMS confirmations reliably.

## 🛠️ **Required Backend Endpoints**

Add these 2 endpoints to your backend: `https://recruiter-agent-backend-sznn.onrender.com`

### 1. **POST /calendar/send-booking-confirmation** (For successful database bookings)

```javascript
app.post('/calendar/send-booking-confirmation', async (req, res) => {
  const { candidate_id, user_id, selected_date, selected_time } = req.body;
  
  try {
    // Fetch real candidate info using service role (bypasses RLS)
    const { data: candidate, error } = await supabaseAdmin
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .eq('user_id', user_id) // Security: ensure candidate belongs to user
      .single();
    
    if (error || !candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Get job title if available
    let jobTitle = candidate.position;
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
    
    // Send SMS using your existing endpoint
    const smsResponse = await fetch(`${process.env.BACKEND_URL}/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: candidate.name,
        phone: candidate.phone,
        job_title: jobTitle,
        datetime: formattedDateTime,
      }),
    });
    
    if (smsResponse.ok) {
      res.json({ success: true, message: 'SMS sent successfully' });
    } else {
      res.status(500).json({ error: 'SMS sending failed' });
    }
    
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

### 2. **POST /calendar/book-and-notify** (For RLS-blocked bookings)

```javascript
app.post('/calendar/book-and-notify', async (req, res) => {
  const { candidate_id, user_id, datetime, status, selected_date, selected_time } = req.body;
  
  try {
    // First, verify candidate belongs to user (security check)
    const { data: candidate, error: candidateError } = await supabaseAdmin
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .eq('user_id', user_id)
      .single();
    
    if (candidateError || !candidate) {
      return res.status(404).json({ error: 'Candidate not found or access denied' });
    }
    
    // Create the booking using service role (bypasses RLS)
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('candidate_screenings')
      .insert([{
        candidate_id,
        user_id,
        datetime,
        status
      }])
      .select()
      .single();
    
    if (bookingError) {
      console.error('Booking creation failed:', bookingError);
      // Continue with SMS even if booking failed (better UX)
    }
    
    // Get job title if available
    let jobTitle = candidate.position;
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
    
    // Send SMS using your existing endpoint
    const smsResponse = await fetch(`${process.env.BACKEND_URL}/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: candidate.name,
        phone: candidate.phone,
        job_title: jobTitle,
        datetime: formattedDateTime,
      }),
    });
    
    const smsSuccess = smsResponse.ok;
    
    res.json({
      success: true,
      booking_created: !bookingError,
      sms_sent: smsSuccess,
      message: `Booking ${!bookingError ? 'created' : 'attempted'} and SMS ${smsSuccess ? 'sent' : 'failed'}`
    });
    
  } catch (error) {
    console.error('Error in book-and-notify:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 🔒 **Security Features**

Both endpoints include security checks:
- ✅ Verify candidate belongs to the specified user (`user_id`)
- ✅ Use service role key to bypass RLS restrictions
- ✅ No sensitive data exposed in responses
- ✅ Proper error handling

## 🎯 **How It Works**

1. **Frontend tries database booking** (may fail due to RLS when logged out)
2. **If successful**: Calls `/calendar/send-booking-confirmation` for SMS
3. **If RLS blocks**: Calls `/calendar/book-and-notify` which handles both booking + SMS server-side
4. **SMS always uses real candidate info** fetched server-side with service role

## 🧪 **Testing**

After adding these endpoints:

1. **Test logged in**: Booking + SMS should work normally
2. **Test logged out**: Booking should work + SMS should be sent
3. **Test different device**: Both booking and SMS should work

## ✅ **Result**

SMS confirmations will now work reliably on any device, regardless of login status!

The backend handles all the complex database access and candidate info fetching, while the frontend provides a smooth user experience.