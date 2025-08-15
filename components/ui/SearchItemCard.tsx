import { GetItemResponse } from '@/lib/gen/models';
import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Form } from 'react-bootstrap';

interface SearchItemCardProps {
  item: GetItemResponse;
  onAddToCart: (itemId: number, count: number, customInstructions: string) => void;
  currentCartItem?: { count: number; customInstructions: string };
}

export default function SearchItemCard({ item, onAddToCart, currentCartItem }: SearchItemCardProps): React.JSX.Element {
  const [count, setCount] = useState(currentCartItem?.count || 0);
  const [customInstructions, setCustomInstructions] = useState(currentCartItem?.customInstructions || '');

  useEffect(() => {
    setCount(currentCartItem?.count || 0);
    setCustomInstructions(currentCartItem?.customInstructions || '');
  }, [currentCartItem]);

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
    if (item.id !== undefined) {
      if (newCount > 0) {
        onAddToCart(item.id, newCount, customInstructions);
      } else {
        onAddToCart(item.id, 0, customInstructions);
      }
    }
  };

  const handleInstructionsChange = (instructions: string) => {
    setCustomInstructions(instructions);
    if (count > 0 && item.id !== undefined) {
      onAddToCart(item.id, count, instructions);
    }
  };

  const incrementCount = () => handleCountChange(count + 1);
  const decrementCount = () => handleCountChange(Math.max(0, count - 1));

  return (
    <Card className="me-3 mb-3 shadow" style={{ width: '280px', height: '400px' }}>
      <Card.Img variant="top" src={item.imageUrl} style={{ height: '150px', objectFit: 'cover' }} alt={item.name} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-center mb-2">
          <code>{item.name}</code>
        </Card.Title>
        <div className="d-flex justify-content-center mb-2">
          {item.tags?.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-1">
              {tag.name}
            </Badge>
          ))}
        </div>
        <Card.Text className="text-center mb-2 flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {item.description}
        </Card.Text>
        <Card.Text className="text-center mb-3">
          Price: <code>${item.price}</code>
        </Card.Text>

        {count === 0 ? (
          <div className="d-grid mt-auto">
            <Button variant="primary" onClick={incrementCount}>
              Add to Cart
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 mt-auto">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <Button variant="outline-secondary" size="sm" onClick={decrementCount}>
                -
              </Button>
              <span className="fw-bold">{count}</span>
              <Button variant="outline-secondary" size="sm" onClick={incrementCount}>
                +
              </Button>
            </div>

            <Form.Control
              type="text"
              placeholder="Custom instructions (optional)"
              value={customInstructions}
              onChange={(e) => handleInstructionsChange(e.target.value)}
              size="sm"
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
