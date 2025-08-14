'use client';

import React from 'react';
import { GetOrderResponse } from '@/lib/gen/models';
import { Card } from 'react-bootstrap';

export interface OrderCardProps {
  order: GetOrderResponse;
  onClick: (order: GetOrderResponse) => void;
}

export default function OrderCard(props: OrderCardProps): React.JSX.Element {
  return (
    <Card
      role="button"
      onClick={() => props.onClick(props.order)}
      className="me-3 mb-3 shadow"
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <Card.Title className="text-center mb-3">
          Order <code>#{props.order.id}</code>
        </Card.Title>
        <hr />
        <Card.Text className="text-center mb-3">
          Table Number: <code>{props.order.tableNumber}</code>{' '}
        </Card.Text>
        <Card.Text className="text-center">
          {' '}
          Ordered on <code>{props.order.orderedAt}</code>
        </Card.Text>
        <Card.Text className="text-center">
          {' '}
          Status: <code>{props.order.status}</code>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
