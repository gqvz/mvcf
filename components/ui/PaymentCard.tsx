import { GetPaymentResponse } from '@/lib/gen/models';
import React from 'react';
import Link from 'next/link';
import { Card } from 'react-bootstrap';

export default function PaymentCard({ payment }: { payment: GetPaymentResponse }): React.JSX.Element {
  return (
    <Card className="me-3 mb-3 shadow">
      <Card.Body>
        <Card.Title className="text-center mb-3">
          Payment <code>#{payment.id}</code>
        </Card.Title>
        <hr />
        <Card.Text className="text-center mb-3">
          {' '}
          Status: <code>{payment.status}</code>
        </Card.Text>
        <Link href={'/orders/' + payment.orderId}>
          <Card.Text className="text-center mb-3">
            {' '}
            Order: <code>#{payment.orderId}</code>
          </Card.Text>
        </Link>
        <Card.Text className="text-center mb-3">
          {' '}
          Tip: <code>${payment.tip}</code>
        </Card.Text>
        <Card.Text className="text-center mb-3">
          {' '}
          Subtotal: <code>${payment.subtotal}</code>
        </Card.Text>
        <Card.Text className="text-center">
          {' '}
          Total: <code>${payment.total}</code>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
