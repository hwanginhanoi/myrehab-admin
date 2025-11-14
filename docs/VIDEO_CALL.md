# Video Call Feature - Agora RTC Integration

This document explains how to use and configure the video calling feature in MyRehab Admin.

## Overview

The video call feature uses **Agora RTC SDK NG** to provide real-time video and audio communication. This is useful for:
- Doctor-patient consultations
- Remote rehabilitation sessions
- Team meetings

## Quick Start

### 1. Get Agora App ID

1. Sign up for a free account at [Agora Console](https://console.agora.io)
2. Create a new project
3. Get your App ID from the project dashboard

### 2. Configure Environment Variables

Add your Agora App ID to your environment variables:

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Agora App ID
NEXT_PUBLIC_AGORA_APP_ID=your_actual_app_id_here
```

### 3. Access Video Call

Navigate to: `/dashboard/video-call`

Or with a specific channel:
```
/dashboard/video-call?channel=consultation-room-1
```

## Features

### ✅ Core Features
- **One-to-many video calls** - Support multiple participants
- **Audio/Video controls** - Mute microphone, turn off camera
- **Camera switching** - Switch between front/back camera (mobile)
- **Responsive UI** - Works on desktop, tablet, and mobile
- **Real-time indicators** - See who's muted, who has video on/off
- **User management** - Automatic user join/leave detection

### 🎨 UI Features
- Professional video grid layout
- Dark theme optimized for video calls
- Local video preview
- Remote participant tiles
- Control bar with intuitive icons
- Loading states and error handling

## Usage

### Starting a Call

1. Enter a **channel name** (e.g., `consultation-123`)
2. Click **Join Call**
3. Grant camera and microphone permissions when prompted

### In-Call Controls

- **Microphone** 🎤 - Toggle audio on/off
- **Camera** 📹 - Toggle video on/off
- **Switch Camera** 🔄 - Switch between cameras (mobile)
- **Leave Call** 📞 - End the call and return to dashboard

### Multiple Participants

- All participants must join the **same channel name**
- Video grid automatically adjusts based on number of participants
- Maximum participants depends on your Agora plan

## Technical Details

### File Structure

```
myrehab-admin/
├── app/(admin)/dashboard/video-call/
│   └── page.tsx                    # Main video call page
├── hooks/
│   └── use-agora-video-call.ts    # Agora RTC hook
├── lib/
│   └── agora-config.ts            # Agora configuration
└── docs/
    └── VIDEO_CALL.md              # This file
```

### Key Components

#### 1. Agora Configuration (`lib/agora-config.ts`)
- App ID configuration
- SDK settings (codec, resolution, bitrate)
- Validation helpers

#### 2. Custom Hook (`hooks/use-agora-video-call.ts`)
- Manages Agora client lifecycle
- Handles local/remote tracks
- Event listeners for user join/leave
- Audio/video control functions

#### 3. Video Call Page (`app/(admin)/dashboard/video-call/page.tsx`)
- Pre-call UI (channel input)
- In-call UI (video grid + controls)
- Error handling and loading states

### Video Quality Settings

Default configuration (can be customized in `lib/agora-config.ts`):

```typescript
{
  resolution: 640x480,
  frameRate: 30 fps,
  bitrate: 400-1000 Kbps
}
```

## Production Deployment

### Token Authentication

For production, you should use token-based authentication:

1. Set up an Agora Token Server
2. Add the token server URL to environment variables:
   ```
   NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL=https://your-server.com/api/token
   ```

3. Modify the hook to fetch tokens from your server

### Security Best Practices

- ✅ Use token authentication in production
- ✅ Set token expiration time
- ✅ Implement role-based access control
- ✅ Validate channel names server-side
- ✅ Monitor usage to prevent abuse

## Troubleshooting

### Camera/Microphone Not Working

1. **Check browser permissions**
   - Ensure camera/mic permissions are granted
   - Check browser settings

2. **HTTPS Required**
   - WebRTC requires HTTPS in production
   - Use `localhost` for development

3. **Browser Compatibility**
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: Full support
   - Mobile browsers: Check device permissions

### Connection Issues

1. **Check Agora App ID**
   - Verify App ID is correct
   - Check console for errors

2. **Network Requirements**
   - Ensure firewall allows WebRTC
   - Check corporate proxy settings

3. **Channel Limits**
   - Free tier: Limited concurrent users
   - Upgrade plan if needed

### No Remote Video

1. **Wait for users to join**
   - Other users must join the same channel

2. **Check remote user's camera**
   - Remote user may have camera off
   - Look for "(Camera Off)" indicator

## API Reference

### useAgoraVideoCall Hook

```typescript
const {
  // State
  isJoined,          // Boolean: In call or not
  isLoading,         // Boolean: Loading state
  error,             // String | null: Error message
  remoteUsers,       // Array: Remote participants
  localUid,          // UID | null: Your user ID
  isMicMuted,        // Boolean: Mic muted state
  isCameraOff,       // Boolean: Camera off state

  // Actions
  joinChannel,       // Function: Join the channel
  leaveChannel,      // Function: Leave the channel
  toggleMicrophone,  // Function: Toggle mic
  toggleCamera,      // Function: Toggle camera
  switchCamera,      // Function: Switch camera (mobile)
} = useAgoraVideoCall({ channel: 'room-1' });
```

## Pricing

Agora offers a free tier with limited minutes:
- **10,000 minutes/month** free
- Additional usage billed per minute
- Check [Agora Pricing](https://www.agora.io/en/pricing/) for details

## Support

- **Agora Documentation**: https://docs.agora.io
- **Agora GitHub**: https://github.com/AgoraIO
- **Community**: https://agora-ticket.agora.io

## Future Enhancements

Potential features to add:
- [ ] Screen sharing
- [ ] Recording functionality
- [ ] Chat messaging
- [ ] Whiteboard integration
- [ ] Virtual backgrounds
- [ ] Beauty filters
- [ ] Call statistics/quality indicators
