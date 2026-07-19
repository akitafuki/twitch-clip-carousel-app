import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { type TwitchClip } from '../types/twitch';

const ExternalLinkIcon = () => (
  <svg width="2em" height="2em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="2em" height="2em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V7l-6-6zm-4 16H8V7h3v5h5v6zm2-8V7h3l3 3h-3v3h-3z" />
  </svg>
);

interface ClipCarouselProps {
  clips: TwitchClip[];
  handleSetNewChannel: () => void;
  volume: number;
}

const ClipCarousel: React.FC<ClipCarouselProps> = ({ clips, handleSetNewChannel, volume }) => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [localVolume, setLocalVolume] = useState(volume);
  const [elapsed, setElapsed] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const currentClip = clips[index];

  const handleNextClip = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % clips.length);
    setIsLoading(true);
  }, [clips.length]);

  // Handle active progress bar timing and clip transitions
  useEffect(() => {
    setElapsed(0);
    if (!currentClip || isLoading) return;

    const intervalTime = 100; // ms
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + intervalTime / 1000;
        if (next >= currentClip.duration) {
          clearInterval(timer);
          handleNextClip();
          return currentClip.duration;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [currentClip, isLoading, handleNextClip]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        eventName: 'setVolume',
        value: localVolume / 100,
      }, '*');
    }
  };

  useEffect(() => {
    if (iframeRef.current && !isLoading) {
      iframeRef.current.contentWindow?.postMessage({
        eventName: 'setVolume',
        value: localVolume / 100,
      }, '*');
    }
  }, [localVolume, isLoading]);
  
  const embedUrl = currentClip
    ? `${currentClip.embed_url}&parent=${window.location.hostname}&autoplay=true&muted=false&preload=metadata`
    : '';

  const progressPercent = currentClip ? (elapsed / currentClip.duration) * 100 : 0;

  return (
    <div className="vh-100 d-flex flex-column bg-black">
      <div 
        className="flex-grow-1 position-relative"
        style={{ minHeight: '300px', minWidth: '400px' }}
      >
        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading Clip...</p>
          </div>
        )}
        
        {currentClip && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            height="100%"
            width="100%"
            allow="autoplay"
            allowFullScreen
            title={currentClip.title}
            className="border-0"
            onLoad={handleIframeLoad}
            style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}
          ></iframe>
        )}
      </div>

      <div className="w-100 p-3 bg-dark text-white">
        <ProgressBar now={progressPercent} className="mb-2 custom-progress" />
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{currentClip?.title}</h5>
            <p className="mb-0">Clipped by: {currentClip?.creator_name} | Views: {currentClip?.view_count}</p>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-4" style={{ width: '180px' }}>
              <span className="me-2 text-white-50">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={localVolume}
                onChange={(e) => setLocalVolume(Number(e.target.value))}
                className="form-range custom-slider"
              />
              <span className="ms-2 small text-white-50" style={{ width: '35px' }}>{localVolume}%</span>
            </div>
            <Button variant="link" onClick={handleNextClip} className="text-white">
              Next Clip
            </Button>
            <Button variant="link" href={currentClip?.url} target="_blank" className="text-white">
              <ExternalLinkIcon />
            </Button>
            <Button variant="link" onClick={() => currentClip && navigator.clipboard.writeText(currentClip.url)} className="text-white">
              <CopyIcon />
            </Button>
            <Button variant="outline-light" onClick={handleSetNewChannel}>
              Set New Channel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipCarousel;