// Test script để kiểm tra AI detection
// Chạy trong browser console

async function testAIDetection() {
  console.log('=== TESTING AI DETECTION ===');
  
  // 1. Test camera access
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    console.log('✅ Camera access granted');
    
    // 2. Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    document.body.appendChild(video);
    
    // 3. Wait for video to load
    await new Promise(resolve => {
      video.onloadedmetadata = resolve;
    });
    
    console.log('✅ Video loaded', {
      width: video.videoWidth,
      height: video.videoHeight
    });
    
    // 4. Create canvas and capture screenshot
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const screenshot = canvas.toDataURL('image/jpeg', 0.8);
    
    console.log('✅ Screenshot captured', {
      length: screenshot.length
    });
    
    // 5. Test API call
    const response = await fetch('http://localhost:8082/api/proctoring/analyze-frame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: screenshot,
        examId: 'test-exam',
        studentId: 'test-student'
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API call successful', data);
    } else {
      console.error('❌ API call failed', response.status, await response.text());
    }
    
    // Cleanup
    stream.getTracks().forEach(track => track.stop());
    document.body.removeChild(video);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Chạy test
testAIDetection();
