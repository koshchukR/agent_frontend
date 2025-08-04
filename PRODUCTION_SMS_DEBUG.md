# 🔍 Production SMS Debug Guide

## 🚨 **Issue**
- ✅ SMS works locally
- ❌ SMS doesn't work in production

This suggests an environment/configuration difference.

## 🧪 **Debug Steps**

### **Step 1: Check Console Logs**
Book an appointment in production and check browser console for:

```
=== SMS CONFIRMATION ATTEMPT ===
Environment: { mode: "production", backendUrl: "https://...", isDev: false, isProd: true }
🚀 METHOD 1: Trying backend SMS endpoint...
Backend SMS URL: https://recruiter-agent-backend-sznn.onrender.com/send-booking-sms
Backend SMS payload: { candidate_id: "...", user_id: "...", selected_date: "...", selected_time: "..." }
Backend SMS Response Status: 200
Backend SMS Response: { status: 200, data: { success: true, candidate_name: "...", phone: "..." } }
✅ SMS sent successfully via backend!
SMS sent to: +1234567890 for candidate: John Doe
```

**If Method 1 fails, you'll see:**
```
❌ Backend SMS failed, trying fallback method...
🚀 METHOD 2: Trying original SMS method...
Testing backend connectivity...
Backend connectivity test: 200
SMS API URL: https://recruiter-agent-backend-sznn.onrender.com/send-confirmation
🚀 SENDING SMS with payload: { name: "...", phone: "...", ... }
SMS Response Status: 200
SMS Response Headers: { ... }
SMS API Response: { status: 200, data: { ... } }
```

## 🎯 **Common Issues & Solutions**

### **Issue 1: CORS Error**
**Console shows:** `Access to fetch at '...' has been blocked by CORS policy`

**Solution:** Add CORS headers to your backend `/send-confirmation` endpoint:
```javascript
app.post('/send-confirmation', (req, res) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Your existing SMS logic...
});
```

### **Issue 2: Backend Not Reachable**
**Console shows:** `Backend connectivity test failed: TypeError: Failed to fetch`

**Solutions:**
- Check if backend is deployed and running
- Verify backend URL is correct
- Check if backend has any downtime

### **Issue 3: SMS API Credentials**
**Console shows:** `SMS Response Status: 401` or `403`

**Solution:** Check if production backend has correct SMS API credentials (Twilio keys, etc.)

### **Issue 4: Different Phone Number Format**
**Console shows:** SMS sent successfully but phone number format is different

**Solution:** Check if production vs local environments format phone numbers differently

### **Issue 5: Rate Limiting**
**Console shows:** `SMS Response Status: 429`

**Solution:** SMS provider might be rate limiting production requests

## 🔧 **Quick Fixes to Try**

### **Fix 1: Test Backend Directly**
Open this URL in browser: `https://recruiter-agent-backend-sznn.onrender.com/send-confirmation`
- Should show an error (not 404)
- If 404, endpoint doesn't exist

### **Fix 2: Test with curl**
```bash
curl -X POST https://recruiter-agent-backend-sznn.onrender.com/send-confirmation \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+1234567890","job_title":"Test","datetime":"Test"}'
```

### **Fix 3: Check Backend Logs**
Check your backend service logs (Render.com dashboard) for errors when SMS endpoint is called.

## 📱 **Expected Working Flow**

**In console, you should see:**
1. ✅ `Backend connectivity test: 200`
2. ✅ `SMS Response Status: 200` 
3. ✅ `SMS API Response: { success: true, ... }`
4. ✅ SMS received on phone

**If any step fails, that's where the issue is!**

## 🚀 **Next Steps**

1. **Book appointment in production**
2. **Check console logs**
3. **Send me the logs** - I can tell you exactly what's wrong!

The enhanced logging will show us exactly where the production SMS is failing.