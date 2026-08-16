import React, { useRef } from 'react';

export default function VideoBackground({ src }) {
  const videoRef = useRef(null);

  if (!src) return null;

  return (
    <>
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        src={src}
      />
      <div className="background-overlay" aria-hidden="true" />
    </>
  );
}
