# SMS Workflow API Update

## Overview

Updated the SMS workflow function to include `candidate_id` and `user_id` parameters when sending requests to the backend endpoint.

## Changes Made

### ✅ **Updated API Payload**
The SMS workflow now sends additional parameters to help the backend identify the specific candidate and user context.

### **Previous Payload Format:**
```json
{
  "name": "Roman",
  "phone": "+380664374069",
  "job_title": "UI/UX Designer"
}
```

### **New Payload Format:**
```json
{
  "name": "Roman",
  "phone": "+380664374069", 
  "job_title": "UI/UX Designer",
  "candidate_id": "candidate-uuid-123",
  "user_id": "user-uuid-456"
}
```

## Implementation Details

### **File Modified:** `src/components/dashboard/CandidatesList.tsx`

#### **1. Added Auth Import**
```typescript
import { useAuth } from "../../contexts/AuthContext";
```

#### **2. Added Auth Hook**
```typescript
export const CandidatesList = () => {
  const { user } = useAuth();
  // ... other hooks
```

#### **3. Updated Function Signature**
```typescript
const handleStartWorkflow = async (
  name: string,
  phone: string,
  job_title: string,
  candidate_id: string,    // ✅ NEW
  user_id: string          // ✅ NEW
): Promise<void> => {
```

#### **4. Updated Function Call**
```typescript
await handleStartWorkflow(
  candidate.name,
  candidate.phone,
  assignedJobTitle,
  candidateId,           // ✅ NEW - Candidate ID
  user?.id || ''         // ✅ NEW - Current user ID
);
```

#### **5. Updated API Request Body**
```typescript
body: JSON.stringify({
  name,
  phone,
  job_title,
  candidate_id,          // ✅ NEW
  user_id,               // ✅ NEW
}),
```

## API Endpoint Details

### **Endpoint:** `https://recruiter-agent-backend-sznn.onrender.com/send-sms`

### **Method:** POST

### **Headers:**
```json
{
  "Content-Type": "application/json"
}
```

### **Request Body:**
```json
{
  "name": "string",           // Candidate's full name
  "phone": "string",          // Candidate's phone number (with country code)
  "job_title": "string",      // Job title assigned to the candidate
  "candidate_id": "string",   // UUID of the candidate from Supabase
  "user_id": "string"         // UUID of the current platform user (recruiter/company)
}
```

## Use Cases for New Parameters

### **Backend Benefits:**
1. **User Context**: Backend can identify which platform user initiated the workflow
2. **Candidate Tracking**: Backend can associate the SMS with a specific candidate record
3. **Data Isolation**: Backend can ensure proper data segregation per user
4. **Analytics**: Backend can track workflow success rates per user/candidate
5. **Personalization**: Backend can customize SMS content based on candidate/user data

### **Example Usage in Backend:**
```javascript
// Backend can now do:
app.post('/send-sms', (req, res) => {
  const { name, phone, job_title, candidate_id, user_id } = req.body;
  
  // Log workflow initiation
  console.log(`User ${user_id} started workflow for candidate ${candidate_id}`);
  
  // Update candidate status in database
  updateCandidateStatus(candidate_id, 'workflow_initiated');
  
  // Send personalized SMS
  const message = `Hi ${name}, you've been selected for the ${job_title} position...`;
  sendSMS(phone, message);
  
  // Track analytics
  trackWorkflowEvent(user_id, candidate_id, 'sms_sent');
});
```

## Testing

### **Test the Updated Workflow:**
1. **Login to Dashboard**: Authenticate as a platform user
2. **Navigate to Candidates**: Go to candidates list
3. **Assign Job & Recruiter**: Ensure candidate has both assigned
4. **Click "Start workflow"**: Initiate the SMS workflow
5. **Check Network Tab**: Verify the request includes all 5 parameters
6. **Backend Logs**: Check backend receives candidate_id and user_id

### **Expected Request:**
```bash
curl -X POST https://recruiter-agent-backend-sznn.onrender.com/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "job_title": "Software Engineer",
    "candidate_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  }'
```

## Backward Compatibility

### **⚠️ Backend Update Required**
The backend endpoint should be updated to handle the new parameters:

```javascript
// Backend should accept but not require the new fields for backward compatibility
const { name, phone, job_title, candidate_id, user_id } = req.body;

// Handle cases where new fields might be missing (for backward compatibility)
if (candidate_id) {
  // New functionality with candidate_id
}

if (user_id) {
  // New functionality with user_id  
}

// Core SMS functionality remains the same
sendSMS(phone, generateMessage(name, job_title));
```

## Error Handling

### **Missing User Context**
The frontend handles cases where user context might be missing:

```typescript
user?.id || ''  // Fallback to empty string if user is not authenticated
```

### **API Error Response**
The notification system will display any backend errors:

```typescript
if (!res.ok) {
  setWorkflowNotification({
    type: 'error',
    title: 'Workflow Failed',
    message: `Failed to start SMS workflow: ${data.error || 'Unknown error'}`
  });
}
```

## Benefits of This Update

### **🎯 Enhanced Tracking**
- Backend can now track which user initiated each workflow
- Better analytics and reporting capabilities
- Improved audit trail for compliance

### **🔒 Data Security**
- Proper user context for data isolation
- Candidate-specific workflow tracking  
- Enhanced security through proper identification

### **📊 Analytics & Insights**
- User-specific workflow success rates
- Candidate journey tracking
- Performance metrics per recruiter/company

### **🚀 Future Enhancements**
- Personalized SMS content based on user/candidate data
- Automated follow-up workflows
- Integration with calendar booking system
- Advanced reporting and dashboards

The SMS workflow now provides complete context to the backend, enabling enhanced functionality and better data management! ✅