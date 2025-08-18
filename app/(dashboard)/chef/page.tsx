'use client';

import React, { useEffect } from 'react';
import { GetOrderItemsByStatusRequest, OrderItemsApi } from '@/lib/gen/apis';
import { GetOrderItemResponse, ItemStatus } from '@/lib/gen/models';
import PendingItemCard from '@/components/ui/PendingItemCard';
import Config from '@/lib/config';
import { Container } from 'react-bootstrap';
import {ResponseError} from "@/lib/gen/runtime";

export default function ChefPage(): React.JSX.Element {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pendingItems, setPendingItems] = React.useState<Array<GetOrderItemResponse>>([]);

  useEffect(() => {
    (async () => {
      const client = new OrderItemsApi(Config);
      const items = await client.getOrderItemsByStatus( { status: ItemStatus.Pending });
      const items2 = await client.getOrderItemsByStatus( { status: ItemStatus.Preparing });
      items.push(...items2);
      setPendingItems(items);
      setLoading(false);
    })();
  }, []);

  const handleMarkAsComplete = async (orderItem: GetOrderItemResponse) => {
    const client = new OrderItemsApi(Config);
    let newStatus: ItemStatus = ItemStatus.Pending;
    if (orderItem.status === ItemStatus.Pending) newStatus = ItemStatus.Preparing;
    else if (orderItem.status === ItemStatus.Preparing) newStatus = ItemStatus.Completed;
    try {
      await client.editOrderItemStatus({id: orderItem.id || 0, status: {status: newStatus}});
    } catch (error) {
      if (error instanceof ResponseError) {
        if (error.response.status === 409) {
          alert("This item has already been marked as completed or is in a different state.");
          window.location.reload();
        }
      }
    }
    window.location.reload();
  };

  return (
    <>
      <h1 className="text-center w-100 mt-3"> Pending Items </h1>
      <hr />
      <Container id="orders-list" className="mt-3 d-flex flex-fill flex-wrap flex-column">
        {loading ? (
          <h1 className="text-center">Loading</h1>
        ) : pendingItems.length > 0 ? (
          pendingItems.map((item, index) => (
            <PendingItemCard key={index} orderItem={item} onClick={handleMarkAsComplete} />
          ))
        ) : (
          <h1 className="text-center">No pending items</h1>
        )}
      </Container>
    </>
  );
}
