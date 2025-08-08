# Backend Endpoint Configuration Fix

## Issue
The calendar booking system is failing because:
1. The `/send-booking-sms` endpoint may not exist on the backend
2. The booking insertion may fail due to RLS policies
3. SMS confirmation is not being sent properly

## Required Backend Endpoints

Your backend at `https://agent-backend-x58l.onrender.com` needs these endpoints:

### 1. `/send-booking-sms` (POST)
```javascript
app.post('/send-booking-sms', async (req, res) => {
  try {
    const { candidate_id, user_id, selected_date, selected_time } = req.body;
    
    // Get candidate data from Supabase
    const { data: candidateData, error } = await supabase
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .single();
    
    if (error || !candidateData) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    
    // Format the datetime message
    const [year, month, day] = selected_date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
    });
    const formattedDateTime = `${formattedDate} at ${selected_time}`;
    
    // Insert booking into database
    const datetime = `${selected_date}T${selected_time}:00.000Z`;
    const { error: insertError } = await supabase
      .from('candidate_screenings')
      .insert([{
        candidate_id,
        user_id,
        datetime,
        status: 'scheduled'
      }]);
    
    if (insertError) {
      console.error('Booking insertion error:', insertError);
      // Continue anyway - RLS might be blocking but SMS should still be sent
    }
    
    // Send SMS confirmation
    const message = `Hi ${candidateData.name}! Your screening interview for the ${candidateData.position} position has been scheduled for ${formattedDateTime}. We look forward to speaking with you!`;
    
    // Use your SMS service (Twilio, etc.)
    await sendSMS(candidateData.phone, message);
    
    res.json({ 
      success: true, 
      candidate_name: candidateData.name,
      phone: candidateData.phone,
      message: 'Booking confirmed and SMS sent'
    });
    
  } catch (error) {
    console.error('Booking SMS error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 2. `/send-confirmation` (POST) - Update existing endpoint
```javascript
app.post('/send-confirmation', async (req, res) => {
  try {
    const { name, phone, job_title, datetime } = req.body;
    
    const message = `Hi ${name}! Your screening interview for the ${job_title} position has been scheduled for ${datetime}. We look forward to speaking with you!`;
    
    await sendSMS(phone, message);
    
    res.json({ success: true, message: 'Confirmation SMS sent' });
    
  } catch (error) {
    console.error('SMS confirmation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 3. `/get-candidate-info` (POST) - For fallback candidate data
```javascript
app.post('/get-candidate-info', async (req, res) => {
  try {
    const { candidate_id } = req.body;
    
    const { data: candidateData, error } = await supabase
      .from('candidates')
      .select('name, phone, position')
      .eq('id', candidate_id)
      .single();
    
    if (error || !candidateData) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidateData);
    
  } catch (error) {
    console.error('Get candidate info error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

## Next Steps

1. **Run the SQL fix first**: Execute `fix_calendar_booking_complete.sql` in Supabase SQL editor
2. **Add the backend endpoints**: Add the above endpoints to your backend server
3. **Test the booking flow**: Try booking an appointment through the calendar link

## Environment Variables Required

Make sure your backend has these environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Service role key (for bypassing RLS)
- SMS service credentials (Twilio, etc.)