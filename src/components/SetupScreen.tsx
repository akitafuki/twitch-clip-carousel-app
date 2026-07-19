import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

interface SetupScreenProps {
  onSettingsSet: (settings: {
    channelName: string;
    clipType: string;
    clipPeriod: string;
    clipLength: string;
    volume: number;
  }) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSettingsSet }) => {
  const [channelInput, setChannelInput] = useState('');
  const [clipType, setClipType] = useState('Top');
  const [clipPeriod, setClipPeriod] = useState('24h');
  const [clipLength, setClipLength] = useState('any');
  const [volume, setVolume] = useState(100);


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (channelInput.trim()) {
      onSettingsSet({
        channelName: channelInput.trim(),
        clipType,
        clipPeriod,
        clipLength,
        volume,
      });
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 text-white">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Card className="setup-card p-3 p-sm-4 text-white border-0">
            <Card.Body className="text-center">
              <h1 className="mb-3 glow-title">Twitch Clip Carousel</h1>
              <p className="text-muted mb-4">
                Enter a Twitch channel name and select your clip preferences to start watching.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formChannelName">
                  <Form.Label>Channel Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Channel Name"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    required
                    className="text-center"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="d-block text-center mb-3">Clip Selection Type</Form.Label>
                  <div className="custom-check-group">
                    <label className="custom-tag-check">
                      <input
                        type="radio"
                        name="clipType"
                        value="Top"
                        checked={clipType === 'Top'}
                        onChange={(e) => setClipType(e.target.value)}
                      />
                      <span className="custom-tag-label">🔥 Top Clips</span>
                    </label>
                    <label className="custom-tag-check">
                      <input
                        type="radio"
                        name="clipType"
                        value="Random"
                        checked={clipType === 'Random'}
                        onChange={(e) => setClipType(e.target.value)}
                      />
                      <span className="custom-tag-label">🎲 Random Clips</span>
                    </label>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Clip Period</Form.Label>
                  <Form.Select 
                    aria-label="Clip Period"
                    value={clipPeriod}
                    onChange={(e) => setClipPeriod(e.target.value)}
                  >
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="all">All time</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Clip Length</Form.Label>
                  <Form.Select 
                    aria-label="Clip Length"
                    value={clipLength}
                    onChange={(e) => setClipLength(e.target.value)}
                  >
                    <option value="short">Short (0-30s)</option>
                    <option value="medium">Medium (30-60s)</option>
                    <option value="long">Long (60s+)</option>
                    <option value="any">Any</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formVolume">
                  <Form.Label className="d-flex justify-content-between">
                    <span>Default Volume</span>
                    <span className="text-white-50">{volume}%</span>
                  </Form.Label>
                  <Form.Range
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="custom-slider"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" size="lg" className="w-100">
                  Watch Clips
                </Button>
              </Form>
              <p className="text-muted mt-4 mb-0">
                <small>by AkitaFuki</small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SetupScreen;
