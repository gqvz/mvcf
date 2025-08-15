import { GetItemResponse } from '@/lib/gen/models';
import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';

interface CartItemCardProps {
  item: GetItemResponse;
  count: number;
  customInstructions: string;
  onRemove: (itemId: number) => void;
}

export default function CartItemCard({
  item,
  count,
  customInstructions,
  onRemove
}: CartItemCardProps): React.JSX.Element {
  return (
    <Card className="mb-3 shadow-sm" style={{ maxWidth: '300px' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">
            <code>{item.name}</code>
          </Card.Title>
          <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id || 0)} className="ms-2">
            ×
          </Button>
        </div>

        <div className="d-flex justify-content-center mb-2">
          {item.tags?.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-1">
              {tag.name}
            </Badge>
          ))}
        </div>

        <Card.Text className="text-center mb-2">{item.description}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold">Quantity: {count}</span>
          <span className="fw-bold">${(item.price || 0) * count}</span>
        </div>

        {customInstructions && (
          <Card.Text className="text-muted small mb-0">
            <strong>Instructions:</strong> {customInstructions}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}
