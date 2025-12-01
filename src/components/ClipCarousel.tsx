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
}

const ClipCarousel: React.FC<ClipCarouselProps> = ({ clips, handleSetNewChannel }) => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentClip = clips[index];

  const handleNextClip = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % clips.length);
    setIsLoading(true);
  }, [clips.length]);

  useEffect(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    if (currentClip) {
      autoplayTimeoutRef.current = setTimeout(() => {
        handleNextClip();
      }, (currentClip.duration + 1) * 1000); // Add a 1-second buffer
    }
    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [currentClip, handleNextClip]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const embedUrl = currentClip
    ? `${currentClip.embed_url}&parent=${window.location.hostname}&autoplay=true&muted=false&preload=metadata`
    : '';

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
            src={embedUrl}
            height="100%"
            width="100%"
            allowFullScreen
            title={currentClip.title}
            className="border-0"
            onLoad={handleIframeLoad}
            style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}
          ></iframe>
        )}
      </div>

      <div className="w-100 p-3 bg-dark text-white">
        <ProgressBar now={0} className="mb-2" />
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{currentClip?.title}</h5>
            <p className="mb-0">Clipped by: {currentClip?.creator_name} | Views: {currentClip?.view_count}</p>
          </div>
          <div className="d-flex align-items-center">
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