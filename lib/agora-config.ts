// Agora RTC Configuration
export const AGORA_CONFIG = {
  // Get your App ID from Agora Console: https://console.agora.io
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || '7ec2c27d896f4a70afcf26758c86a6c4',

  // Hardcoded token (temporary - for development only)
  // Generate token at: https://console.agora.io/projects
  // Go to your project > Generate temp RTC token
  token: '007eJxTYFhc8fO9ir/NLI+FfKoOW9efs2bmbvi68sA7gf2fDRYdeR2twGCemmyUbGSeYmFplmaSaG6QmJacZmRmbmqRbGGWaJZsErOQP7MhkJFhk48oMyMDBIL4TAz52QwMAEJTHuI=',

  // Token server URL (optional, for production use)
  tokenServerUrl: process.env.NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL || '',
} as const;

// Validate Agora configuration
export function validateAgoraConfig() {
  if (!AGORA_CONFIG.appId) {
    console.warn('Agora App ID is not configured. Please add NEXT_PUBLIC_AGORA_APP_ID to your environment variables.');
    return false;
  }
  return true;
}

// Agora SDK configuration options
export const AGORA_SDK_CONFIG = {
  // Codec to use for encoding and decoding video
  codec: 'vp8' as const,

  // Video encoder configuration (optimized for varying network conditions)
  videoEncoderConfig: {
    // Resolution (lower for better compatibility)
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    // Frame rate (fps) - adaptive
    frameRate: { ideal: 15, max: 30 },
    // Bitrate (Kbps) - wider range for better adaptation
    bitrateMin: 200,
    bitrateMax: 1500,
  },

  // Audio encoder configuration
  audioEncoderConfig: {
    // Sample rate
    sampleRate: 48000,
    // Stereo or mono
    stereo: false, // Mono for better bandwidth efficiency
    // Bitrate (Kbps)
    bitrate: 32, // Lower for better network handling
  },
} as const;
