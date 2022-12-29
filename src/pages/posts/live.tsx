import flvJS from "flv.js";
import { useEffect, useRef } from "react";
const Live = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const flvRef = useRef<flvJS.Player>();
  useEffect(() => {
    if (flvJS.isSupported()) {
      flvRef.current = flvJS.createPlayer({
        type: "flv",
        isLive: true,
        cors: true,
        hasVideo: true,
        url: "http://localhost:8000/live/live.flv",
      });
      if (videoRef.current) {
        flvRef.current.attachMediaElement(videoRef.current);
        flvRef.current.load();
        flvRef.current.play();
      }
    }
  }, []);

  return (
    <>
      <video ref={videoRef} width="100%" controls></video>
    </>
  );
};

export default Live;
