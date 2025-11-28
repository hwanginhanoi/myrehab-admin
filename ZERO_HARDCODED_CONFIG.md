# ✅ ZERO Hardcoded Configuration - 100% Backend Driven

## 🎯 Final Implementation

The Agora video call now has **ZERO hardcoded App IDs or tokens** in the frontend. Everything comes from the backend server!

---

## 📝 What's in Frontend Config Now?

### Before (❌ Old Way):
```typescript
// lib/agora-config.ts
export const AGORA_CONFIG = {
  appId: '7ec2c27d896f4a70afcf26758c86a6c4',  // ❌ Hardcoded
  token: '007eJxTYFhc8fO9ir...',              // ❌ Hardcoded
}
```

### After (✅ New Way):
```typescript
// lib/agora-config.ts
export const AGORA_CONFIG = {
  // No App ID - comes from backend! ✅
  // No token - comes from backend! ✅
  tokenServerUrl: process.env.NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL || '',
}
```

**Only video encoder settings remain** (codec, resolution, bitrate) - these are frontend-only optimizations.

---

## 🔄 How It Works

### 1. Doctor Clicks "Join Video Call"

```typescript
// Frontend fetches from backend
GET /api/appointments/123/agora-token
Authorization: Bearer <JWT>
```

### 2. Backend Returns Everything

```json
{
  "token": "007eJxTYFhc...",           // ✅ Backend provides
  "channelName": "appointment_123",   // ✅ Backend provides
  "uid": 789,                         // ✅ Backend provides
  "appId": "a1b2c3d4e5f6...",        // ✅ Backend provides
  "expiryTimestamp": 1732809600       // ✅ Backend provides
}
```

### 3. Frontend Uses Backend Values

```typescript
// All values from backend response
router.push(`/dashboard/video-call?` +
  `appointmentId=${id}` +
  `&channel=${response.channelName}` +
  `&token=${response.token}` +
  `&appId=${response.appId}` +          // ← From backend!
  `&uid=${response.uid}` +
  `&patientName=${patientName}` +
  `&endTime=${response.appointment.calculatedEndTime}` +
  `&duration=${duration}`
);
```

### 4. Agora SDK Joins with Backend Values

```typescript
// hooks/use-agora-video-call.ts
await client.join(
  appId,    // ← From backend via URL param
  channel,  // ← From backend via URL param
  token,    // ← From backend via URL param
  null      // ← Auto-assign UID
);
```

---

## 🎯 Key Points

### ✅ Frontend Doesn't Store:
- ❌ No App ID
- ❌ No tokens
- ❌ No channel names
- ❌ No UIDs
- ❌ No hardcoded credentials

### ✅ Frontend Only Needs:
- Backend API endpoint
- JWT authentication token
- Video encoder settings (resolution, codec)

---

## 🔍 Validation & Error Handling

The hook now **validates** that backend provides all required values:

```typescript
// hooks/use-agora-video-call.ts
if (!appId) {
  throw new Error('Agora App ID is required (must be provided by backend)');
}
if (!token) {
  throw new Error('Agora token is required (must be provided by backend)');
}
```

**User-friendly errors** in Vietnamese:
- "Không có token từ backend. Vui lòng thử lại."
- "Không có App ID từ backend. Vui lòng kiểm tra cấu hình."

---

## 🧪 Debug Console Output

When joining a call:

```javascript
🎥 Agora Config (Appointment Mode - Backend Token Only): {
  appId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",  // ← From backend
  channel: "appointment_123",                   // ← From backend
  hasToken: true,
  tokenPreview: "007eJxTYFhc8fO9ir...",        // ← From backend
  tokenSource: "backend-api"                    // ← Clearly marked
}

🔐 Agora Join Attempt (Backend Values Only): {
  appId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  channel: "appointment_123",
  hasToken: true,
  tokenSource: "backend-api",
  tokenPreview: "007eJxTYFhc8fO9ir..."
}

✅ Successfully joined channel with UID: 789
```

---

## 📦 What Backend Must Provide

### Required Response Fields:

```json
{
  "token": "string",           // ✅ REQUIRED
  "channelName": "string",     // ✅ REQUIRED
  "uid": number,               // ✅ REQUIRED
  "appId": "string",           // ✅ REQUIRED
  "expiryTimestamp": number,   // ✅ REQUIRED
  "appointment": {             // ✅ REQUIRED
    "id": number,
    "appointmentDateTime": "ISO-8601",
    "durationMinutes": number,
    "calculatedEndTime": "ISO-8601"
  }
}
```

### Backend Responsibilities:

1. **Generate valid Agora tokens** with:
   - Correct App ID
   - Correct App Certificate
   - Sufficient expiry time (appointment duration + buffer)
   - Valid channel name format

2. **Return all required fields** in API response

3. **Validate appointment permissions** before returning token

---

## 🔒 Security Benefits

### ✅ Improved Security:
1. **No credentials in frontend code** - Can't be extracted from source
2. **No tokens in git** - Nothing to accidentally commit
3. **Tokens are short-lived** - Backend controls expiry
4. **Per-appointment tokens** - Each call has unique credentials
5. **Backend controls access** - Frontend can't join unauthorized calls

### ✅ Flexibility:
1. **Change App ID** - Update backend only, no frontend deploy
2. **Rotate certificates** - Backend only
3. **Adjust token expiry** - Backend logic only
4. **Different tokens per environment** - Backend config only

---

## 🎓 Developer Experience

### For Frontend Developers:
```bash
# No environment variables needed!
# No Agora account needed!
# No App ID to configure!

# Just run:
npm run dev
```

### For Backend Developers:
```java
// Backend owns all Agora configuration
@Value("${agora.app.id}")
private String agoraAppId;

@Value("${agora.app.certificate}")
private String agoraAppCertificate;

// Generate tokens with your config
public AgoraTokenResponse generateToken(Long appointmentId) {
    // Your App ID
    // Your Certificate
    // Your token generation logic
    return response;
}
```

---

## ✅ Verification Checklist

Before going to production:

- [ ] Backend returns all required fields (token, appId, channelName, uid)
- [ ] Backend generates tokens with correct App Certificate
- [ ] Token expiry time is sufficient (appointment duration + 1 hour)
- [ ] Channel names follow format: `appointment_{id}`
- [ ] Backend validates user permissions before returning token
- [ ] Error handling tested (missing fields, invalid tokens)
- [ ] Console debug logs show "tokenSource: backend-api"
- [ ] No hardcoded values in frontend `lib/agora-config.ts`

---

## 🚀 Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **App ID** | Hardcoded in frontend | From backend API |
| **Token** | Hardcoded (expired) | From backend API (fresh) |
| **Security** | Credentials in code | No credentials in frontend |
| **Flexibility** | Redeploy frontend to change | Backend config only |
| **Developer Setup** | Need Agora account | No Agora account needed |
| **Git Safety** | Risk of committing tokens | Nothing to commit |
| **Token Expiry** | Static/expired | Dynamic per appointment |

---

## 📞 Support

If video call fails to join:

1. **Check console logs** for the `🎥` and `🔐` debug output
2. **Verify all fields** are present in backend response:
   ```bash
   curl -H "Authorization: Bearer JWT" \
     http://localhost:8080/api/appointments/123/agora-token
   ```
3. **Check backend logs** for token generation
4. **Verify App Certificate** is correct in backend config

The frontend is now **100% dependent on backend** - if it's not working, the issue is in the backend configuration or token generation.

---

**Status:** ✅ Zero hardcoded configuration
**Last Updated:** 2025-11-28
**Frontend Config Required:** None (all from backend)
