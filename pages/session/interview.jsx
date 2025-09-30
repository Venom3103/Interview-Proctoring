import { useEffect, useRef, useState } from 'react';
import FocusDetection from '../../components/FocusDetection';
import { useRouter } from 'next/router';

export default function InterviewPage() {
  const router = useRouter();
  const { sessionId } = router.query;

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [warning, setWarning] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [events, setEvents] = useState([]);

  // Hook up webcam & recording
  useEffect(() => {
    if (!videoRef.current) return;

    const startVideoAndRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error('Webcam error:', err);
      }
    };

    startVideoAndRecording();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopAndUploadRecording = async () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, `session-${sessionId}.webm`);
        formData.append('sessionId', sessionId || 'demo');

        try {
          await fetch('/api/upload', { method: 'POST', body: formData });
          console.log('Recording uploaded successfully');
        } catch (err) {
          console.error('Upload failed:', err);
        }
      };
    }
  };

  const handleNoFace = () => {
    setWarning(true);
    setTimeout(() => {
      setWarning(false);
      setSessionEnded(true);
      stopAndUploadRecording();
      alert('Session ended due to no face detected.');
      router.push('/'); // Redirect after session ends
    }, 5000); // 5 sec no-face -> end
  };

  const handleMultipleFaces = () => {
    setWarning(true);
    setTimeout(() => {
      setWarning(false);
      setSessionEnded(true);
      stopAndUploadRecording();
      alert('Session ended due to multiple faces detected.');
      router.push('/');
    }, 5000); // 5 sec multiple faces -> end
  };

  const handleEvent = (ev) => {
    setEvents(prev => [...prev, ev]);
    if (ev.type === 'no_face') handleNoFace();
    if (ev.type === 'multiple_faces') handleMultipleFaces();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Interview Session: {sessionId}</h1>

      <div className="relative">
        <video
          ref={videoRef}
          className="rounded-lg border-4 border-purple-600"
          width="640"
          height="480"
          autoPlay
          muted
        />
        {warning && (
          <div className="absolute inset-0 bg-red-500 opacity-50 flex items-center justify-center">
            <p className="text-3xl font-bold text-white animate-pulse">
              {events[events.length - 1]?.type === 'no_face' ? 'No face detected!' : 'Multiple faces detected!'}
            </p>
          </div>
        )}
      </div>

      {sessionEnded && (
        <div className="text-red-500 text-2xl font-bold mt-4">Session Ended</div>
      )}

      <FocusDetection videoRef={videoRef} onEvent={handleEvent} />

      <div className="mt-4 w-full max-w-xl bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Events Log</h2>
        <ul className="list-disc list-inside max-h-48 overflow-y-auto">
          {events.map((e, i) => (
            <li key={i}>
              {e.timestamp}: {e.type} {e.label ? `(${e.label})` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
