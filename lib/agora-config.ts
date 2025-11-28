// Agora RTC Configuration
// Note: App ID and tokens are now provided by the backend server
// No hardcoded values needed in frontend!

export const AGORA_CONFIG = {
  // Token server URL (optional, for production use)
  tokenServerUrl: process.env.NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL || '',
} as const;

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
