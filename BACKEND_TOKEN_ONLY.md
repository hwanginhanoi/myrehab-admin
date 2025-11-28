# ✅ Backend Token Only - Configuration Complete

## 🎯 Changes Made

The Agora video call implementation now **ONLY uses tokens from the backend server**. No hardcoded tokens are used.

---

## 📝 What Was Updated

### 1. **Removed Hardcoded Token** (`lib/agora-config.ts`)

**Before:**
```typescript
export const AGORA_CONFIG = {
  appId: '7ec2c27d896f4a70afcf26758c86a6c4',
  token: '007eJxTYFhc8fO9ir...',  // ❌ Old hardcoded token
}
```

**After:**
```typescript
export const AGORA_CONFIG = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || '7ec2c27d896f4a70afcf26758c86a6c4',
  // ✅ No hardcoded token - only backend tokens
}
```

---

### 2. **Updated Hook** (`hooks/use-agora-video-call.ts`)

**Removed:**
- ❌ `useHardcodedToken` parameter
- ❌ `AGORA_CONFIG.token` usage
- ❌ Token fallback logic

**Now:**
- ✅ **Always** uses the `token` parameter (from backend)
- ✅ Clearer debug logging shows `tokenSource: 'backend'`

**Before:**
```typescript
const effectiveToken = useHardcodedToken ? AGORA_CONFIG.token : token;
```

**After:**
```typescript
const effectiveToken = token; // Always from backend
```

---

### 3. **Updated Video Call Page** (`app/(admin)/dashboard/video-call/page.tsx`)

**Added:**
- ✅ Validation for missing token
- ✅ Validation for missing App ID
- ✅ Better error messages
- ✅ Clear debug logging

**New Features:**
```typescript
// Validates token before joining
if (!tokenFromUrl) {
  toast.error('Không có token từ backend. Vui lòng thử lại.');
  return;
}

// User-friendly error messages
if (error.includes('invalid token')) {
  errorMessage = 'Token không hợp lệ hoặc đã hết hạn...';
}
```

---

## 🔍 How It Works Now

### Flow for Appointments:

1. **Doctor clicks "Join Video Call"** on appointment details page

2. **Frontend fetches token** from backend:
   ```
   GET /api/appointments/123/agora-token
   Authorization: Bearer <JWT>
   ```

3. **Backend returns:**
   ```json
   {
     "token": "007eJxTYFhc...",
     "channelName": "appointment_123",
     "uid": 789,
     "appId": "a1b2c3d4e5f6g7h8...",
     "expiryTimestamp": 1732809600
   }
   ```

4. **Frontend navigates** to video call page:
   ```
   /dashboard/video-call?appointmentId=123&channel=appointment_123&token=007eJx...&appId=a1b2c3d4...
   ```

5. **Agora SDK joins** using backend token:
   ```typescript
   await client.join(appId, channel, token, null);
   ```

---

## 🎨 Debug Console Output

When joining a call, you'll see:

```javascript
🎥 Agora Config (Appointment Mode - Backend Token Only): {
  appId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  channel: "appointment_123",
  hasToken: true,
  tokenPreview: "007eJxTYFhc8fO9ir...",
  tokenSource: "backend-api"
}

🔐 Agora Join Attempt: {
  appId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  channel: "appointment_123",
  hasToken: true,
  tokenSource: "backend",
  tokenPreview: "007eJxTYFhc8fO9ir..."
}

✅ Successfully joined channel with UID: 789
```

---

## ⚠️ Error Handling

### Missing Token Error

If backend doesn't return a token:
```
❌ Lỗi
Không có token từ backend. Vui lòng thử lại.
```

### Invalid Token Error

If token is invalid or expired:
```
❌ Lỗi gọi video
Token không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại hoặc thử tham gia lại cuộc gọi.
```

### App ID Mismatch Error

If App IDs don't match:
```
❌ Lỗi gọi video
Cấu hình App ID không đúng. Vui lòng liên hệ quản trị viên.
```

---

## 🔧 Backend Requirements

For this to work, your backend must:

### 1. Generate Valid Tokens

```java
// Example Java code
String token = RtcTokenBuilder.buildTokenWithUid(
    appId,              // Same as frontend
    appCertificate,     // Your Agora App Certificate
    channelName,        // "appointment_123"
    uid,                // 0 for auto-assign
    Role.Role_Publisher,
    expireTimestamp     // Current time + appointment duration + buffer
);
```

### 2. Return Correct Response

```json
{
  "token": "007eJxTYFhc...",           // ✅ Required
  "channelName": "appointment_123",   // ✅ Required
  "uid": 0,                           // ✅ Required (0 = auto-assign)
  "appId": "a1b2c3d4...",            // ✅ Required
  "expiryTimestamp": 1732809600,     // ✅ Required
  "appointment": { ... }              // ✅ Required
}
```

### 3. Use Same App ID

**CRITICAL:** Backend must use the SAME Agora App ID as frontend.

**Check:**
```bash
# Frontend App ID (from lib/agora-config.ts or env)
NEXT_PUBLIC_AGORA_APP_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Backend App ID (must match!)
AGORA_APP_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## ✅ Verification Checklist

Before testing:

- [ ] Backend returns `appId` in response
- [ ] Backend returns `token` in response
- [ ] Backend App ID matches frontend App ID
- [ ] Token is generated with correct App Certificate
- [ ] Token expiry time is sufficient (> appointment duration)
- [ ] Channel name follows format: `appointment_{id}`
- [ ] UID is 0 or unique per user

---

## 🧪 Testing Steps

### 1. Check Backend Response

```bash
# Replace with your JWT and appointment ID
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:8080/api/appointments/123/agora-token
```

**Verify response has:**
- ✅ `token` field
- ✅ `appId` field
- ✅ `channelName` field
- ✅ `uid` field

### 2. Test Video Call

1. Go to an APPROVED ONLINE appointment
2. Click "Tham gia cuộc gọi video"
3. Check browser console for debug logs
4. Should see: `✅ Successfully joined channel with UID: ...`

### 3. If Error Occurs

Check console logs:
1. Is `hasToken` true?
2. Is `appId` correct?
3. Does `tokenPreview` show a token?
4. Is `tokenSource` showing "backend"?

---

## 🎯 Key Points

1. ✅ **No hardcoded tokens** - All tokens come from backend
2. ✅ **Token validation** - Checks for missing/invalid tokens
3. ✅ **Better errors** - User-friendly Vietnamese error messages
4. ✅ **Debug logging** - Easy to diagnose token issues
5. ✅ **App ID matching** - Frontend uses backend's App ID

---

## 📞 If Still Having Issues

1. **Copy console logs** (including the `🎥` and `🔐` logs)
2. **Copy backend response** (from `/agora-token` endpoint)
3. **Copy error message** (if any)
4. **Share with team** for debugging

The most common issue is **App ID mismatch** between frontend and backend.

---

**Last Updated:** 2025-11-28
**Status:** ✅ Ready for testing
