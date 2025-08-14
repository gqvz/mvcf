import { GetItemResponse, GetOrderItemResponse } from '@/lib/gen/models';
import React, { useEffect } from 'react';
import { ItemsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { Card, Container } from 'react-bootstrap';

export default function OrderItemCard({ orderItem }: { orderItem: GetOrderItemResponse }): React.JSX.Element {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [item, setItem] = React.useState<GetItemResponse>({});

  useEffect(() => {
    const itemsClient = new ItemsApi(Config);
    (async () => {
      const itemResponse = await itemsClient.getItemById({ id: orderItem.itemId || 0 });
      setItem(itemResponse);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center">Loading Item...</h1>
      </Container>
    );
  }

  return (
    <Card className="shadow mb-3 bg-body-tertiary">
      <Card.Body className="d-flex align-items-stretch">
        <div className="d-flex flex-column justify-content-between me-4">
          <Card.Img
            src={item.imageUrl}
            className="rounded-3 object-fit-cover w-100 h-100 object-fit-contain"
            style={{ maxHeight: 200 }}
            alt="image"
          />
        </div>
        <div className="d-flex flex-column flex-grow-1">
          <Card.Title>{item.name}</Card.Title>
          <div className="d-flex mb-1">
            {item.tags?.map((tag) => (
              <code key={tag.id} className="p-1 shadow rounded-2 me-2 bg-body-secondary">
                {tag.name}
              </code>
            ))}
          </div>
          <Card.Text>{item.description}</Card.Text>
          <Card.Text>{orderItem.customInstructions}</Card.Text>
          <Card.Text>{orderItem.status === 'completed' ? 'Completed' : 'Preparing'}</Card.Text>
        </div>
        <h2 className="text-end pe-4 align-content-center">
          <code>
            {orderItem.quantity +
              ' x $' +
              item.price?.toFixed(2) +
              ' = $' +
              (orderItem?.quantity || 0) * (item?.price || 0)}
          </code>
        </h2>
      </Card.Body>
    </Card>
  );
}
