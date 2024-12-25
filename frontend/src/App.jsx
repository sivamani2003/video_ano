import React, { useState, useRef, useEffect } from 'react';
import hero from './assets/hero-video.mp4';
import 'video.js/dist/video-js.css'; // Import Video.js CSS
import videojs from 'video.js';
function App() {
  const [text, setText] = useState('');
  const [pauseTime, setPauseTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported by this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false; 
    recognition.lang = 'en-US'; 

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handlePause = () => {
    setPauseTime(videoRef.current.currentTime);
  };

  const processVideo = async () => {
    if (!text.trim()) {
      alert('Please enter some text first');
      return;
    }

    setProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Reset video to start
    video.currentTime = 0;
    await new Promise(resolve => {
      video.oncanplay = resolve;
    });

    // Set the canvas resolution
    const canvasWidth = 1200;  // Increased canvas width
    const canvasHeight = 800;  // Increased canvas height
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set up media recorder
    streamRef.current = canvas.captureStream();
    mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video-with-text.webm';
      a.click();
      URL.revokeObjectURL(url);
      setProcessing(false);
    };
    mediaRecorderRef.current.start();

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
      if (Math.abs(video.currentTime - pauseTime) < 1) {
        ctx.font = '32px Arial'; 
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.fillText(text, 20, 20);
      }

      if (video.currentTime < video.duration) {
        requestAnimationFrame(drawFrame);
      } else {
        mediaRecorderRef.current.stop();
      }
    };

    video.play();
    drawFrame();
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-[600px]">
        <video
          ref={videoRef}
          src={hero}
          width="600"
          height="400"
          controls
          onPause={handlePause}
          className="rounded-lg shadow-lg"
        />
        
        <div className="absolute top-4 left-4 text-white text-2xl font-bold shadow-text">
          {text}
        </div>

        <div className="absolute bottom-16 left-4 bg-black/50 p-2 rounded w-full">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text"
            className="px-2 py-1 w-full rounded"
          />
        </div>

        <div className="absolute top-20 left-4 space-x-4">
          <button
            onClick={toggleSpeechRecognition}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>

          <button
            onClick={processVideo}
            disabled={processing}
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${processing ? 'cursor-not-allowed bg-gray-500' : ''}`}
          >
            {processing ? 'Processing...' : 'Download Video with Text'}
          </button>
        </div>

        {pauseTime > 0 && (
          <div className="absolute top-16 left-4 text-white ">
            Paused at: {pauseTime.toFixed(2)} seconds
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      <style jsx>{`
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
}

export default App;
 