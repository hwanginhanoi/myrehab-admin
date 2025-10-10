# Frontend Integration Guide - Exercise File Upload

This guide explains how to integrate with the MyRehab API for creating exercises with video and image uploads using presigned URLs.

## Overview

The API uses a **presigned URL approach** for file uploads:
1. Frontend requests presigned URLs from API
2. Frontend uploads files directly to MinIO storage
3. Frontend creates exercise with the MinIO file URLs
4. API validates files exist before saving exercise

## Prerequisites

- Admin or Doctor authentication token
- Video file (MP4, AVI, MOV, WMV, WebM, MKV)
- Image file (JPEG, JPG, PNG, GIF, WebP)
- Both files are **mandatory** for exercise creation

## Step-by-Step Integration

### Step 1: Get Presigned URL for Video

```javascript
async function getVideoPresignedUrl(videoFile) {
  const response = await fetch('/api/files/presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      fileName: videoFile.name,
      contentType: videoFile.type,
      fileType: 'video',
      durationMinutes: 60 // URL expires in 1 hour
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get video presigned URL');
  }

  return await response.json();
}
```

**Response:**
```json
{
  "uploadUrl": "http://localhost:9000/myrehab-files/videos/exercises/uuid-123.mp4?AWSAccessKeyId=...",
  "fileUrl": "http://localhost:9000/myrehab-files/videos/exercises/uuid-123.mp4",
  "fileName": "uuid-123.mp4",
  "folder": "videos/exercises",
  "expiresAt": "2024-01-01T13:00:00",
  "contentType": "video/mp4"
}
```

### Step 2: Get Presigned URL for Image

```javascript
async function getImagePresignedUrl(imageFile) {
  const response = await fetch('/api/files/presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      fileName: imageFile.name,
      contentType: imageFile.type,
      fileType: 'image',
      durationMinutes: 60
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get image presigned URL');
  }

  return await response.json();
}
```

### Step 3: Upload Files to MinIO

```javascript
async function uploadFileToMinIO(uploadUrl, file, onProgress = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

### Step 4: Create Exercise

```javascript
async function createExercise(exerciseData, videoFileUrl, imageFileUrl) {
  const response = await fetch('/api/exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      ...exerciseData,
      videoUrl: videoFileUrl,
      imageUrl: imageFileUrl
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create exercise');
  }

  return await response.json();
}
```

## Complete Integration Example

```javascript
async function createExerciseWithFiles(exerciseData, videoFile, imageFile) {
  try {
    // Validate files
    if (!videoFile || !imageFile) {
      throw new Error('Both video and image files are required');
    }

    // Show loading state
    setLoading(true);
    setProgress({ video: 0, image: 0 });

    // Step 1 & 2: Get presigned URLs
    const [videoPresigned, imagePresigned] = await Promise.all([
      getVideoPresignedUrl(videoFile),
      getImagePresignedUrl(imageFile)
    ]);

    // Step 3: Upload files to MinIO
    await Promise.all([
      uploadFileToMinIO(
        videoPresigned.uploadUrl,
        videoFile,
        (progress) => setProgress(prev => ({ ...prev, video: progress }))
      ),
      uploadFileToMinIO(
        imagePresigned.uploadUrl,
        imageFile,
        (progress) => setProgress(prev => ({ ...prev, image: progress }))
      )
    ]);

    // Step 4: Create exercise
    const exercise = await createExercise(
      exerciseData,
      videoPresigned.fileUrl,
      imagePresigned.fileUrl
    );

    console.log('Exercise created successfully:', exercise);
    return exercise;

  } catch (error) {
    console.error('Failed to create exercise:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}
```

## React Component Example

```jsx
import React, { useState } from 'react';

function CreateExerciseForm() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ video: 0, image: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 0,
    repetitions: 0,
    sets: 0,
    price: 0,
    categoryId: null
  });
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const exercise = await createExerciseWithFiles(
        formData,
        videoFile,
        imageFile
      );

      // Success - redirect or show success message
      alert('Exercise created successfully!');

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Exercise Title"
        required
      />

      {/* File inputs */}
      <input
        type="file"
        accept="video/mp4,video/avi,video/mov,video/wmv,video/webm,video/mkv"
        onChange={(e) => setVideoFile(e.target.files[0])}
        required
      />

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      />

      {/* Progress bars */}
      {loading && (
        <div>
          <div>Video: {progress.video.toFixed(0)}%</div>
          <div>Image: {progress.image.toFixed(0)}%</div>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Exercise'}
      </button>
    </form>
  );
}
```

## Error Handling

### Common Errors:

1. **File validation errors**:
   ```json
   {
     "message": "Invalid video file type. Allowed types: MP4, AVI, MOV, WMV, WebM, MKV"
   }
   ```

2. **File doesn't exist**:
   ```json
   {
     "message": "video file does not exist in storage. Please upload the file first using presigned URL."
   }
   ```

3. **Authentication errors**:
   ```json
   {
     "message": "Access Denied"
   }
   ```

4. **File size errors**:
   ```json
   {
     "message": "Video file size exceeds maximum allowed size of 500MB"
   }
   ```

## File Size Limits

- **Videos**: 500MB max
- **Images**: 10MB max
- **Total per request**: 100MB max (general limit)

## Security Notes

- ✅ Presigned URLs expire after 60 minutes
- ✅ Only Admin and Doctor roles can create exercises
- ✅ File type validation on both frontend and backend
- ✅ File existence validation before exercise creation
- ✅ All uploads go through secure presigned URLs

## Viewing Files (Different Access Levels)

### **Images (Public Access)**
Images can be accessed directly:

```javascript
// Images are directly accessible - no API call needed
function ExerciseImage({ imageUrl }) {
  return <img src={imageUrl} alt="Exercise" />;
}
```

### **Videos (Strict Protection)**
Videos require presigned URLs with short expiration:

```javascript
async function getVideoViewingUrl(videoUrl) {
  const response = await fetch(`/api/files/view/video?fileUrl=${encodeURIComponent(videoUrl)}&durationMinutes=5`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get video viewing URL');
  }

  return await response.text(); // Returns presigned URL (expires in 5 minutes)
}

// Video player with automatic URL refresh
function VideoPlayer({ videoUrl }) {
  const [viewingUrl, setViewingUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshVideoUrl = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = await getVideoViewingUrl(videoUrl);
      setViewingUrl(url);
    } catch (error) {
      console.error('Failed to load video:', error);
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  useEffect(() => {
    refreshVideoUrl();

    // Refresh URL every 4 minutes (before 5-minute expiry)
    const interval = setInterval(refreshVideoUrl, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshVideoUrl]);

  if (isLoading) return <div>Loading video...</div>;

  return viewingUrl ? (
    <video
      controls
      src={viewingUrl}
      onError={refreshVideoUrl} // Refresh on error
    />
  ) : (
    <div>Video unavailable</div>
  );
}
```


## File Access Control

### **Images:**
- ✅ **Upload**: Via presigned URLs (Admin/Doctor only)
- ✅ **View**: Direct access (All users) OR presigned URLs for extra security
- ✅ **Delete**: Via API endpoint (Admin/Doctor only)
- ✅ **Download**: Allowed (images are public)

### **Videos:**
- ✅ **Upload**: Via presigned URLs (Admin/Doctor only)
- ✅ **View/Stream**: Via short-lived presigned URLs only (All users, 5 min expiry)
- ✅ **Delete**: Via API endpoint (Admin/Doctor only)
- ❌ **Direct Download**: Blocked (videos are private)

## Testing

Use these test endpoints:
- **Local MinIO**: http://localhost:9000 (files are private)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **API Base**: http://localhost:8080/api

## Troubleshooting

1. **Upload fails**: Check presigned URL hasn't expired
2. **Exercise creation fails**: Ensure both files uploaded successfully
3. **Progress not updating**: Check if `onProgress` callback is properly set
4. **"Access Denied" when viewing**: Files are private - use `/api/files/view` endpoint
5. **Video won't play**: Get fresh viewing URL (they expire after 15 minutes)

This approach provides **controlled access** - users can view/stream files but cannot download them directly! 🔒