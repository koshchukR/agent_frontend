# Calendar Debug Guide

## Issue Identified

The calendar page shows a blank screen due to malformed UUIDs in the URL parameters.

## Problem Analysis

### **Original URL (Problematic):**
```
https://screen-iq.onrender.com/calendar?candidate_id=dba9a61b-499b-4902%20-a533-185c499c28e6&user_id=35fb6f9b-06cd-4a48-9342%20-80904e6baf0b
```

### **Issues Found:**
1. **Encoded Spaces**: `%20` in the middle of UUIDs
2. **Invalid UUID Format**: UUIDs contain spaces which breaks them
3. **URL Parameter Parsing**: React Router receives malformed UUIDs

### **Decoded UUIDs:**
- `candidate_id`: `dba9a61b-499b-4902 -a533-185c499c28e6` (contains space)
- `user_id`: `35fb6f9b-06cd-4a48-9342 -80904e6baf0b` (contains space)

## Solutions Implemented

### **1. Fixed Calendar Component**
Updated `src/pages/Calendar.tsx` to handle malformed UUIDs:

```typescript
// Clean and fix the UUIDs (remove spaces and decode URL encoding)
const rawCandidateId = searchParams.get('candidate_id');
const rawUserId = searchParams.get('user_id');

const candidateId = rawCandidateId?.replace(/\s+/g, '')?.trim();
const userId = rawUserId?.replace(/\s+/g, '')?.trim();
```

### **2. Added Debug Logging**
Added comprehensive logging to identify issues:

```typescript
console.log('Calendar Debug Info:', {
  rawCandidateId,
  rawUserId,
  candidateId,
  userId,
  searchParams: Object.fromEntries(searchParams.entries())
});
```

### **3. Created Test Page**
Added `/calendar-test` route for debugging URL parameters without complex UI.

## Corrected URL Format

### **Fixed URL (Should Work):**
```
https://screen-iq.onrender.com/calendar?candidate_id=dba9a61b-499b-4902-a533-185c499c28e6&user_id=35fb6f9b-06cd-4a48-9342-80904e6baf0b
```

### **Changes Made:**
- Removed spaces from UUIDs
- Proper UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Testing Steps

### **1. Test Debug Page First**
Visit the test page to verify parameter parsing:
```
https://screen-iq.onrender.com/calendar-test?candidate_id=dba9a61b-499b-4902-a533-185c499c28e6&user_id=35fb6f9b-06cd-4a48-9342-80904e6baf0b
```

### **2. Check Browser Console**
Open Developer Tools → Console to see debug output:
```javascript
Calendar Debug Info: {
  rawCandidateId: "dba9a61b-499b-4902-a533-185c499c28e6",
  rawUserId: "35fb6f9b-06cd-4a48-9342-80904e6baf0b",
  candidateId: "dba9a61b-499b-4902-a533-185c499c28e6",
  userId: "35fb6f9b-06cd-4a48-9342-80904e6baf0b",
  searchParams: { ... }
}
```

### **3. Test Main Calendar**
Visit the main calendar with corrected URL:
```
https://screen-iq.onrender.com/calendar?candidate_id=dba9a61b-499b-4902-a533-185c499c28e6&user_id=35fb6f9b-06cd-4a48-9342-80904e6baf0b
```

## Root Cause Analysis

### **Where the Spaces Come From:**
The spaces in UUIDs suggest they may be:
1. **Database Issue**: UUIDs stored with spaces in database
2. **Copy-Paste Error**: Manual copying introduced spaces
3. **Code Generation**: Bug in URL generation code

### **Fix at Source:**
Check where these UUIDs are generated/retrieved:
```sql
-- Check database for malformed UUIDs
SELECT id, LENGTH(id), id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' as valid_uuid
FROM candidates 
WHERE id LIKE '% %';
```

## URL Generation Best Practices

### **Correct URL Generation:**
```typescript
// Good: Clean UUIDs before URL generation
const generateBookingURL = (candidateId: string, userId: string) => {
  const cleanCandidateId = candidateId.replace(/\s+/g, '').trim();
  const cleanUserId = userId.replace(/\s+/g, '').trim();
  
  return `/calendar?candidate_id=${cleanCandidateId}&user_id=${cleanUserId}`;
};
```

### **Validate UUIDs:**
```typescript
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
```

## Error Handling Improvements

### **Enhanced Parameter Validation:**
```typescript
const validateParameters = (candidateId: string | null, userId: string | null) => {
  if (!candidateId || !userId) {
    return { valid: false, error: 'Missing required parameters' };
  }
  
  const cleanCandidateId = candidateId.replace(/\s+/g, '').trim();
  const cleanUserId = userId.replace(/\s+/g, '').trim();
  
  if (!isValidUUID(cleanCandidateId) || !isValidUUID(cleanUserId)) {
    return { valid: false, error: 'Invalid UUID format' };
  }
  
  return { valid: true, candidateId: cleanCandidateId, userId: cleanUserId };
};
```

## Next Steps

### **1. Immediate Fix**
- ✅ Use corrected URL without spaces
- ✅ Test with debug page first
- ✅ Check browser console for errors

### **2. Long-term Fixes**
- [ ] Fix UUID generation at source
- [ ] Add UUID validation in backend
- [ ] Implement proper URL encoding/decoding
- [ ] Add error boundaries for React errors

### **3. Database Cleanup**
If UUIDs in database have spaces:
```sql
-- Clean up malformed UUIDs
UPDATE candidates 
SET id = REPLACE(id, ' ', '') 
WHERE id LIKE '% %';

UPDATE users 
SET id = REPLACE(id, ' ', '') 
WHERE id LIKE '% %';
```

## Testing Checklist

### ✅ **Parameter Validation**
- [x] Test with corrected URL format
- [x] Check console debug output
- [x] Verify UUID cleaning works
- [x] Test parameter validation

### ✅ **Calendar Functionality**
- [ ] Calendar displays properly
- [ ] Date selection works
- [ ] Time slot selection works
- [ ] Booking functionality works
- [ ] Error handling works

### ✅ **Error Cases**
- [x] Missing parameters show error page
- [x] Malformed UUIDs are cleaned
- [x] Network errors are handled
- [x] Invalid bookings are prevented

The calendar should now work with the corrected URL format! 🎯