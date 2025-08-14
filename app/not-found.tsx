'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function NotFound(): React.JSX.Element {
  const router = useRouter();
  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="border-0 shadow">
            <Card.Body className="p-4 text-center">
              <h1 className="display-4 fw-bold text-warning mb-3">404</h1>
              <h2 className="h4 mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">The page you are looking for does not exist.</p>
              <Button variant="primary" onClick={handleGoHome} size="lg">
                Back to Home
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
