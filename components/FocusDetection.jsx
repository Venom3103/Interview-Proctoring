import { useEffect } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function FocusDetection({ videoRef, onEvent }) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      const faceModel = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      const objModel = await cocoSsd.load();

      let noFaceMs = 0;
      let lastTime = Date.now();

      const loop = async () => {
        if (!mounted) return;
        if (!videoRef.current) return setTimeout(loop, 500);

        const now = Date.now();
        const faces = await faceModel.estimateFaces({
          input: videoRef.current,
          returnTensors: false
        });

        // No face detected
        if (!faces || faces.length === 0) {
          noFaceMs += now - lastTime;
          if (noFaceMs >= 5000) {
            onEvent && onEvent({ type: 'no_face', timestamp: new Date().toISOString() });
            noFaceMs = 0; // reset after firing event
          }
        } else {
          noFaceMs = 0;
          // Multiple faces detected
          if (faces.length > 1) {
            onEvent && onEvent({ type: 'multiple_faces', timestamp: new Date().toISOString() });
          }
        }

        // Object detection (optional)
        const objs = await objModel.detect(videoRef.current);
        objs.forEach(o => {
          if (['cell phone', 'book', 'laptop'].includes(o.class)) {
            onEvent && onEvent({ type: 'item_detected', label: o.class, score: o.score, timestamp: new Date().toISOString() });
          }
        });

        lastTime = now;
        setTimeout(loop, 700);
      };

      loop();
    })();

    return () => { mounted = false; };
  }, [videoRef, onEvent]);

  return null;
}
