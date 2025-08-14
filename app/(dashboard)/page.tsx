'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { OrdersApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { Button, Container, Form } from 'react-bootstrap';
import { ResponseError } from '@/lib/gen/runtime';

export default function Home() {
  const router = useRouter();

  const [tableNumber, setTableNumber] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderClient = new OrdersApi(Config);
    try {
      const response = await orderClient.createOrder({ request: { tableNumber: tableNumber } });
      router.push('/orders/' + response.orderId);
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 409) {
          alert('Table is occupied. Please choose another table.');
        }
      }
    }
  };

  const previousOrders = () => {
    router.push('/orders');
  };

  return (
    <Container className="d-flex flex-column flex-fill justify-content-center" style={{ maxWidth: '400px' }}>
      <Container className="p-4 rounded-3 bg-body-tertiary justify-content-center align-content-center border shadow">
        <h1 className="text-center mb-3"> Welcome to MVC </h1>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Floating>
              <Form.Control
                type="number"
                min={1}
                max={100}
                step={1}
                className="mb-3"
                id="tableNumber"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
              />
              <Form.Label htmlFor="tableNumber">Table Number</Form.Label>
              <Button type="submit" variant="primary" className="w-100">
                Start Ordering
              </Button>
            </Form.Floating>
            <hr className="" />
            <Button variant="primary" className="w-100" onClick={previousOrders}>
              {' '}
              Previous Orders
            </Button>
          </Form>
        </Container>
      </Container>
    </Container>
  );
}
