import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { getChannelId, getClips } from '../services/twitchService';
import { TwitchClip } from '../types/twitch';
import ClipCarousel from './ClipCarousel';

interface ClipSettings {
  channelName: string;
  clipType: string;
  clipPeriod: string;
  clipLength: string;
}

interface AFKScreenProps {
  settings: ClipSettings;
  accessToken: string;
}

const AFKScreen: React.FC<AFKScreenProps> = ({ settings, accessToken }) => {
  const [clips, setClips] = useState<TwitchClip[]>([]);
  const [loadingClips, setLoadingClips] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelAndClips = async () => {
      setLoadingClips(true);
      setError(null);
      try {
        const id = await getChannelId(settings.channelName, accessToken);
        if (id) {
          const fetchedClips = await getClips(
            id,
            accessToken,
            settings.clipType,
            20,
            settings.clipPeriod,
            settings.clipLength
          );
          if (fetchedClips.length > 0) {
            setClips(fetchedClips);
          } else {
            setError('No clips found for this channel with the selected filters.');
          }
        } else {
          setError('Could not find a channel with that name.');
        }
      } catch (err) {
        setError('Failed to fetch Twitch data. Please check your network and API credentials.');
      } finally {
        setLoadingClips(false);
      }
    };

    if (settings.channelName && accessToken) {
      fetchChannelAndClips();
    }
  }, [settings, accessToken]);

  const handleSetNewChannel = () => {
    localStorage.removeItem('twitchClipSettings');
    window.location.reload();
  };

  if (loadingClips) {
    return (
      <Container fluid className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Clips...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center text-center">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-light" onClick={handleSetNewChannel}>Set New Channel</Button>
        </Alert>
      </Container>
    );
  }

  if (clips.length === 0) {
    return (
      <Container fluid className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center text-center">
        <Alert variant="info">
          <p>No clips found for "{settings.channelName}".</p>
          <Button variant="outline-light" onClick={handleSetNewChannel}>Try a Different Channel</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      <ClipCarousel clips={clips} handleSetNewChannel={handleSetNewChannel} />
    </div>
  );
};

export default AFKScreen;
