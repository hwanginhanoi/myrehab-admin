# Agora Video Call Troubleshooting Guide

## ❌ Error: `CAN_NOT_GET_GATEWAY_SERVER: invalid token, authorized failed`

This error means the Agora token is invalid or there's a mismatch between the App ID and token.

---

## 🔍 Debug Steps

### 1. Check Browser Console Logs

When you click "Join Video Call", you should see these logs:

```
🎥 Agora Config: {
  appId: "your-app-id-here",
  channel: "appointment_123",
  hasToken: true,
  tokenPreview: "007eJxTYFhc8fO9ir...",
  useHardcodedToken: false
}

🔐 Agora Join Attempt: {
  appId: "your-app-id-here",
  channel: "appointment_123",
  useHardcodedToken: false,
  hasProvidedToken: true,
  tokenSource: "provided",
  tokenPreview: "007eJxTYFhc8fO9ir..."
}
```

### 2. Verify Backend Response

Check what the backend is returning:

```bash
# Replace 123 with your appointment ID
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/appointments/123/agora-token
```

Expected response:
```json
{
  "token": "007eJxTYFhc...",
  "channelName": "appointment_123",
  "uid": 789,
  "expiryTimestamp": 1732809600,
  "appId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "appointment": {
    "id": 123,
    "appointmentDateTime": "2025-11-28T14:00:00",
    "durationMinutes": 60,
    "calculatedEndTime": "2025-11-28T15:00:00"
  }
}
```

---

## ✅ Common Issues and Solutions

### Issue 1: App ID Mismatch

**Problem:** The App ID in the frontend config doesn't match the backend's App ID.

**Check:**
1. Backend App ID (in backend code or environment variables)
2. Frontend hardcoded App ID in `lib/agora-config.ts`

**Solution:**
```typescript
// lib/agora-config.ts
export const AGORA_CONFIG = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || 'SAME_AS_BACKEND_APP_ID',
  // ...
}
```

**OR** set environment variable:
```bash
# .env.local
NEXT_PUBLIC_AGORA_APP_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### Issue 2: Token Generated with Wrong App ID

**Problem:** Backend generates token with a different App ID than what frontend uses.

**Solution:** Ensure backend uses the SAME Agora App ID when generating tokens.

---

### Issue 3: Token Expired

**Problem:** Token has a TTL (Time To Live) and expires after a certain time.

**Check backend logs:** The backend should log token generation with expiry time.

**Solution:**
- Backend should generate tokens with at least 1-hour expiry
- For appointments, use the appointment duration + buffer time

---

### Issue 4: Wrong Channel Name Format

**Problem:** Channel name contains invalid characters or spaces.

**Check:** Channel names should be alphanumeric with underscores/hyphens only.

**Valid examples:**
- ✅ `appointment_123`
- ✅ `room-456`
- ✅ `consultation_789`

**Invalid examples:**
- ❌ `appointment 123` (space)
- ❌ `room#456` (special char)

---

### Issue 5: UID Mismatch

**Problem:** The UID in the token doesn't match the UID used when joining.

**Check logs:** The UID in the debug logs should match what backend generated.

**Solution:** Use `null` for UID when joining (Agora will auto-assign):
```typescript
await client.join(appId, channel, token, null); // ✅ Auto-assign UID
```

---

## 🔧 Quick Fixes

### Fix 1: Use Backend App ID Directly

Update `lib/agora-config.ts`:

```typescript
export const AGORA_CONFIG = {
  // Comment out or remove hardcoded App ID
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || '',

  // Remove or comment out hardcoded token
  token: '',

  tokenServerUrl: process.env.NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL || '',
} as const;
```

Then set environment variable:
```bash
# .env.local
NEXT_PUBLIC_AGORA_APP_ID=<SAME_AS_BACKEND>
```

### Fix 2: Verify Token Generation on Backend

Make sure backend generates tokens correctly:

```java
// Backend (example)
public AgoraTokenResponse generateToken(Long appointmentId) {
    Appointment appointment = findAppointment(appointmentId);

    String appId = "YOUR_AGORA_APP_ID";
    String appCertificate = "YOUR_AGORA_APP_CERTIFICATE";
    String channelName = "appointment_" + appointmentId;

    // UID should be unique per user (can use userId or auto-assign with 0)
    int uid = 0; // 0 means auto-assign

    // Token expires after appointment duration + 1 hour buffer
    int expireTimestamp = (int)(System.currentTimeMillis() / 1000) +
                          appointment.getDurationMinutes() * 60 + 3600;

    RtcTokenBuilder token = new RtcTokenBuilder();
    String agoraToken = token.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        RtcTokenBuilder.Role.Role_Publisher,
        expireTimestamp
    );

    return new AgoraTokenResponse(
        agoraToken,
        channelName,
        uid,
        expireTimestamp,
        appId,
        appointmentContext
    );
}
```

---

## 🧪 Test Scenarios

### Test 1: Manual Token Test

1. Generate a test token from Agora Console:
   - Go to https://console.agora.io
   - Select your project
   - Go to "Generate Temp Token"
   - Enter channel name: `test_channel_123`
   - Copy the generated token

2. Test in video-call page:
   - Go to `/dashboard/video-call?channel=test_channel_123&token=YOUR_TOKEN&appId=YOUR_APP_ID`
   - Should connect successfully

### Test 2: Backend Token Test

1. Call backend API directly:
```bash
curl -X GET "http://localhost:8080/api/appointments/123/agora-token" \
  -H "Authorization: Bearer YOUR_JWT"
```

2. Use returned values in browser:
```
/dashboard/video-call?channel=CHANNEL_FROM_RESPONSE&token=TOKEN_FROM_RESPONSE&appId=APP_ID_FROM_RESPONSE
```

---

## 📋 Checklist

Before deploying to production:

- [ ] Backend and frontend use the SAME Agora App ID
- [ ] Backend generates tokens with correct App Certificate
- [ ] Tokens have sufficient expiry time (appointment duration + buffer)
- [ ] Channel names are properly formatted (no spaces, special chars)
- [ ] UID is either 0 (auto-assign) or matches backend logic
- [ ] Environment variables are set in `.env.local`
- [ ] Tested with real appointment flow
- [ ] Tested token expiry handling
- [ ] Tested with multiple concurrent calls

---

## 🆘 Still Not Working?

1. **Check browser console** for the debug logs (`🎥 Agora Config` and `🔐 Agora Join Attempt`)
2. **Check backend logs** for token generation details
3. **Verify network** - Check browser Network tab for API call to `/agora-token`
4. **Test with Agora Console token** to isolate if it's a token generation issue
5. **Check Agora Dashboard** - Verify project is active and not suspended

---

## 📞 Contact Backend Team

If the issue persists, provide this info to backend team:

```
Frontend App ID: <from browser console logs>
Backend App ID: <from backend response>
Channel Name: <from browser console logs>
Token Preview: <first 20 chars from logs>
Error Message: CAN_NOT_GET_GATEWAY_SERVER: invalid token, authorized failed
Timestamp: <when error occurred>
```

---

**Last Updated:** 2025-11-28
