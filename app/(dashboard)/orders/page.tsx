'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GetOrderResponse } from '@/lib/gen/models';
import OrderCard from '@/components/ui/OrderCard';
import { OrdersApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { Container } from 'react-bootstrap';

export default function OrdersPage(): React.JSX.Element {
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [orders, setOrders] = React.useState<Array<GetOrderResponse>>([]);

  useEffect(() => {
    (async () => {
      const client = new OrdersApi(Config);
      const orders = await client.getOrders();
      setOrders(orders);
      setLoading(false);
    })();
  }, []);

  const handleOrderClick = (order: GetOrderResponse): void => {
    router.push(`/orders/${order.id}`);
  };

  return (
    <Container id="orders-list" className="mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
      {loading ? (
        <div className="text-center h2">Loading...</div>
      ) : orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order.id} order={order} onClick={handleOrderClick} />)
      ) : (
        <div className="text-center h2">No orders found.</div>
      )}
    </Container>
  );
}
