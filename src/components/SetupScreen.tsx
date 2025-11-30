import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

interface SetupScreenProps {
  onSettingsSet: (settings: {
    channelName: string;
    clipType: string;
    clipPeriod: string;
    clipLength: string;
  }) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSettingsSet }) => {
  const [channelInput, setChannelInput] = useState('');
  const [clipType, setClipType] = useState('Top');
  const [clipPeriod, setClipPeriod] = useState('24h');
  const [clipLength, setClipLength] = useState('any');


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (channelInput.trim()) {
      onSettingsSet({
        channelName: channelInput.trim(),
        clipType,
        clipPeriod,
        clipLength,
      });
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Card bg="dark" text="white" className="p-4 shadow-lg rounded-3">
            <Card.Body className="text-center">
              <h1 className="mb-3">Twitch Clip Carousel</h1>
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
                  <Form.Label>Clip Type</Form.Label>
                  <div className="d-flex justify-content-center">
                    <Form.Check
                      type="radio"
                      label="Top"
                      name="clipType"
                      id="clipTypeTop"
                      value="Top"
                      checked={clipType === 'Top'}
                      onChange={(e) => setClipType(e.target.value)}
                      className="me-3"
                    />
                    <Form.Check
                      type="radio"
                      label="Random"
                      name="clipType"
                      id="clipTypeRandom"
                      value="Random"
                      checked={clipType === 'Random'}
                      onChange={(e) => setClipType(e.target.value)}
                    />
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
