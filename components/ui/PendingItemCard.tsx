import { GetItemResponse, GetOrderItemResponse } from '@/lib/gen/models';
import React, { useState } from 'react';
import { ItemsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { Button, Card, Container } from 'react-bootstrap';

export default function PendingItemCard({
  orderItem,
  onClick
}: {
  orderItem: GetOrderItemResponse;
  onClick: (item: GetOrderItemResponse) => void;
}): React.JSX.Element {
  const [item, setItem] = useState<GetItemResponse>({});
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      const client = new ItemsApi(Config);
      const fetchedItem = await client.getItemById({ id: orderItem.itemId || 0 });
      setItem(fetchedItem);
      setLoading(false);
    })();
  }, [orderItem.itemId]);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center">Loading Item...</h1>
      </Container>
    );
  }

  return (
    <Card className="me-3 mb-3 d-flex bg-body-tertiary shadow">
      <Card.Body className="d-flex align-items-center">
        <h4 className="text-center me-3">{`${orderItem.quantity} x ${item.name}`}</h4>
        <h4 className="text-center me-3 flex-fill">{orderItem.customInstructions}</h4>
        <div className="h-100 align-content-center">
          <Button variant="success" onClick={() => onClick(orderItem)}>
            Mark as completed
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
