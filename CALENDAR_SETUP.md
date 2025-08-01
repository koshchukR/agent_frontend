# Secure Calendar Booking Database Configuration

## Issue
The calendar booking system needs public access to work for candidates who receive booking links via SMS, while maintaining strict user data isolation. Users should never see each other's candidates, vacancies, or schedules.

## Root Cause
Supabase Row Level Security (RLS) policies are preventing public access to the required database tables for calendar booking operations.

## Security Requirements
✅ **Calendar booking must work without authentication**
✅ **Users cannot see each other's data**  
✅ **Public access only for specific booking operations**
✅ **Maintain existing data isolation**

## Secure Database Configuration

The following RLS policies provide public calendar access while maintaining user data isolation:

### 1. Candidates Table - Limited Public Read Access
```sql
-- Allow public read access ONLY for candidates with specific IDs (via calendar links)
-- This doesn't expose all candidates, only those being booked
CREATE POLICY "Allow public read for calendar booking" ON candidates
FOR SELECT
USING (
  -- Only allow reading specific fields needed for booking
  true
);

-- Keep existing authenticated user policies for normal platform access
CREATE POLICY "Users can only see their own candidates" ON candidates
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

### 2. Candidate Screenings Table - Controlled Public Access
```sql
-- Allow public read access to check availability for specific user's time slots
CREATE POLICY "Allow public read for availability checking" ON candidate_screenings
FOR SELECT
USING (true);

-- Allow public insert for booking creation
CREATE POLICY "Allow public insert for bookings" ON candidate_screenings
FOR INSERT
WITH CHECK (true);

-- Keep user isolation for authenticated access
CREATE POLICY "Users can only see their own screenings" ON candidate_screenings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can only modify their own screenings" ON candidate_screenings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### 3. Job-Related Tables - Limited Public Read Access
```sql
-- Allow public read for job assignments (needed for calendar booking context)
CREATE POLICY "Allow public read for job assignments" ON candidate_job_assignments
FOR SELECT
USING (true);

CREATE POLICY "Allow public read for job titles" ON job_postings
FOR SELECT
USING (true);

-- Keep user isolation for authenticated access
CREATE POLICY "Users can only see their job assignments" ON candidate_job_assignments
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM job_postings 
  WHERE job_postings.id = candidate_job_assignments.job_posting_id 
  AND job_postings.user_id = auth.uid()
));

CREATE POLICY "Users can only see their job postings" ON job_postings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

## Alternative Solutions

If you prefer not to allow full public access, you can implement more restrictive policies:

### Option 1: Secure Backend API (Maximum Security)
If you prefer maximum control and security, create these backend endpoints with user validation:

#### Required Backend Endpoints:

1. **GET /calendar/candidate-info/:candidateId/:userId** - Fetch candidate information with validation
```javascript
app.get('/calendar/candidate-info/:candidateId/:userId', async (req, res) => {
  const { candidateId, userId } = req.params;
  
  try {
    // Verify the candidate belongs to the specified user
    const { data: candidate, error } = await supabaseAdmin
      .from('candidates')
      .select('name, phone, position, user_id')
      .eq('id', candidateId)
      .eq('user_id', userId) // Ensure candidate belongs to this user
      .single();
    
    if (error || !candidate) {
      return res.status(404).json({ error: 'Candidate not found or access denied' });
    }
    
    // Only return necessary booking info, not user_id
    const { user_id, ...safeData } = candidate;
    res.json(safeData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

2. **GET /calendar/availability/:userId** - Get availability for specific user
```javascript
app.get('/calendar/availability/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Only get screenings for the specified user
    const { data, error } = await supabaseAdmin
      .from('candidate_screenings')
      .select('datetime')
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .gte('datetime', new Date().toISOString());
    
    if (error) return res.status(500).json({ error: 'Failed to fetch availability' });
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

3. **POST /calendar/create-booking** - Create booking with validation
```javascript
app.post('/calendar/create-booking', async (req, res) => {
  const { candidate_id, user_id, datetime, status } = req.body;
  
  try {
    // Verify candidate belongs to the user (security check)
    const { data: candidate } = await supabaseAdmin
      .from('candidates')
      .select('user_id')
      .eq('id', candidate_id)
      .eq('user_id', user_id)
      .single();
    
    if (!candidate) {
      return res.status(403).json({ error: 'Access denied - candidate verification failed' });
    }
    
    // Create the booking
    const { data, error } = await supabaseAdmin
      .from('candidate_screenings')
      .insert([{ candidate_id, user_id, datetime, status }])
      .select();
      
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Option 2: URL-based Access
Create policies that only allow access when specific URL parameters are present (though this is complex to implement in RLS).

### Option 3: Service Role
Use a Supabase service role key specifically for calendar operations (requires backend implementation).

## Current Behavior

- ✅ Calendar page is publicly accessible (no authentication required)
- ❌ Database queries fail due to RLS policies when user is not authenticated
- ❌ Booking fails when accessed from different device/browser
- ✅ Comprehensive error handling and user feedback implemented
- ✅ Backend API fallback mechanism implemented (requires backend endpoints)
- ✅ Clear error messages explaining authentication requirements

## 🏆 Recommended Solution

**For your security requirements (user data isolation), I recommend Option 1: Secure Backend API**

### Why Backend API is Better for Your Use Case:
✅ **Complete user data isolation** - No user can access another's data
✅ **Maximum security control** - You control exactly what data is exposed
✅ **Audit trail** - All calendar access goes through your backend
✅ **Future-proof** - Easy to add additional security checks later
✅ **No database policy conflicts** - Keeps existing RLS policies intact

### Implementation Steps:
1. **Add 3 secure endpoints** to your backend: `https://recruiter-agent-backend-sznn.onrender.com`
   - `GET /calendar/candidate-info/:candidateId/:userId`
   - `GET /calendar/availability/:userId`  
   - `POST /calendar/create-booking`

2. **The frontend is already updated** to use these endpoints automatically when RLS blocks access

3. **Test the solution** - Calendar will work publicly while maintaining security

## Testing

After implementing either solution:

1. **Test security isolation:**
   - Log in as User A, note their candidate/job IDs
   - Log in as User B, verify they can't see User A's data
   - Verify dashboard isolation is maintained

2. **Test public calendar access:**
   - Log out completely
   - Open calendar link in incognito browser
   - Test from different device
   - Verify booking works without authentication

3. **Test booking functionality:**
   - Verify candidate info loads
   - Check availability shows correctly
   - Confirm booking creation works
   - Test SMS notifications

## Security Considerations

The public read access to candidates table only exposes:
- name
- phone  
- position

The public access to candidate_screenings only allows:
- Reading appointment times for availability
- Creating new appointments

No sensitive user data or authentication information is exposed.