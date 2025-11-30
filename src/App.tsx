import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import SetupScreen from './components/SetupScreen';
import AFKScreen from './components/AFKScreen';
import { getAppAccessToken } from './services/twitchService';

interface ClipSettings {
  channelName: string;
  clipType: string;
  clipPeriod: string;
  clipLength: string;
}

function App() {
  const [settings, setSettings] = useState<ClipSettings | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(true);

  useEffect(() => {
    const storedSettings = localStorage.getItem('twitchClipSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    const fetchToken = async () => {
      const token = await getAppAccessToken();
      setAccessToken(token);
      setLoadingToken(false);
    };
    fetchToken();
  }, []);

  const handleSettingsSet = (newSettings: ClipSettings) => {
    setSettings(newSettings);
    localStorage.setItem('twitchClipSettings', JSON.stringify(newSettings));
  };

  if (!settings) {
    return <SetupScreen onSettingsSet={handleSettingsSet} />;
  }

  if (loadingToken) {
    return (
      <div className="min-vh-100 bg-dark d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p className="text-white">Loading Twitch API...</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center">
        <Alert variant="danger">
          Failed to load Twitch API. Check Client ID and Secret.
        </Alert>
      </div>
    );
  }

  return (
    <AFKScreen settings={settings} accessToken={accessToken} />
  );
}

export default App;

