'use client';

import React, { useEffect } from 'react';
import { ItemsApi, OrderItemsApi, OrdersApi, PaymentsApi, TagsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { GetItemResponse, GetOrderItemResponse, GetOrderResponse, GetTagResponse } from '@/lib/gen/models';
import { useParams, useRouter } from 'next/navigation';
import OrderItemCard from '@/components/ui/OrderItemCard';
import Link from 'next/link';
import { Button, Container } from 'react-bootstrap';
import SearchModal from '@/components/modals/SearchModal';
import TipModal from '@/components/modals/TipModal';
import { useSearchModalStore } from '@/lib/stores/searchModalStore';
import { useTipModalStore } from '@/lib/stores/tipModalStore';

export default function OrderPage(): React.JSX.Element {
  const router = useRouter();
  const { open: openSearchModal, updateSearchList, setSearchLoading } = useSearchModalStore();
  const { open: openTipModal } = useTipModalStore();

  const id = parseInt((useParams().id as string) || 'NaN');

  const [loading, setLoading] = React.useState<boolean>(true);
  const [order, setOrder] = React.useState<GetOrderResponse>({});
  const [items, setItems] = React.useState<Array<GetOrderItemResponse>>([]);
  const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);

  useEffect(() => {
    const ordersClient = new OrdersApi(Config);
    const tagsClient = new TagsApi(Config);
    const orderItems = new OrderItemsApi(Config);
    (async () => {
      const orderPromise = ordersClient.getOrderById({ id: id });
      const itemsPromise = orderItems.getOrderItems({ id: id });
      const tagsPromise = tagsClient.getTags();
      const searchItemsPromise = searchItems();
      const [orderResponse, itemsResponse, tagsResponse, _] = await Promise.all([
        orderPromise,
        itemsPromise,
        tagsPromise,
        searchItemsPromise
      ]);
      setItems(itemsResponse);
      setOrder(orderResponse);
      setTags(tagsResponse);
      setLoading(false);
    })();
  }, []);

  const closeOrderHandler = () => {
    if (order.status !== 'open') {
      return;
    }
    openTipModal(async () => {
      const client = new OrdersApi(Config);
      const paymentsClient = new PaymentsApi(Config);
      const { tip } = useTipModalStore.getState();
      await client.closeOrderById({ id: order.id || 0 });
      alert('Order closed');
      const response = await paymentsClient.createPayment({
        request: {
          orderId: order.id,
          cashierId: order.customerId,
          tip: tip
        }
      });
      router.push('/payments');
    });
  };

  const searchItems = async () => {
    setSearchLoading(true);
    const itemsClient = new ItemsApi(Config);
    const { searchValue, selectedTags } = useSearchModalStore.getState();
    const response = await itemsClient.getItems({
      search: searchValue,
      tags: selectedTags.map((t) => tags[t].name).join(',')
    });
    updateSearchList(response);
    setSearchLoading(false);
  };

  const handleConfirmCart = async (cartItems: Array<{ itemId: number; count: number; customInstructions: string }>) => {
    const orderItemsClient = new OrderItemsApi(Config);

    for (const cartItem of cartItems) {
      await orderItemsClient.createOrderItem({
        id: order?.id || 0,
        request: {
          itemId: cartItem.itemId,
          customInstructions: cartItem.customInstructions,
          quantity: cartItem.count
        }
      });
    }

    alert(`${cartItems.length} items added to order`);

    const orderItems = await orderItemsClient.getOrderItems({ id: order.id || 0 });
    setItems(orderItems);
  };

  if (isNaN(id)) {
    return (
      <main className="flex-fill mt-3 d-flex flex-column">
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <h1 className="text-center">Invalid Order ID</h1>
          <Link href="/orders">
            <Button variant="primary">Back to Orders</Button>
          </Link>
        </Container>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-fill mt-3 d-flex flex-column">
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <h1 className="text-center">Loading Order...</h1>
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-fill mt-3 d-flex flex-column">
      <div>
        <h1 className="text-center mb-2">
          {' '}
          Order <code>#{order.id}</code>
        </h1>
        <h4 className="text-center mb-1">
          {' '}
          Ordered: <code>{order.orderedAt}</code>
        </h4>
        <h4 className="text-center mb-1">
          {' '}
          Table number: <code>{order.tableNumber}</code>
        </h4>
        <h4 className="text-center mb-1">
          {' '}
          Status: <code>{order.status}</code>
        </h4>
      </div>
      <div id="buttons" className="mb-4">
        <div className="d-flex justify-content-center mt-3">
          {order.status === 'open' ? (
            <>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => openSearchModal(tags, searchItems, handleConfirmCart)}
              >
                Add Item
              </Button>
              <Button variant="primary" className="me-2" onClick={closeOrderHandler}>
                Close Order
              </Button>
            </>
          ) : (
            <>
              <Link href={'/orders'}>
                <Button variant="secondary" className="me-2">
                  Back to orders
                </Button>
              </Link>
              <Link href={'/payments'}>
                <Button variant="primary" className="me-2">
                  Go to payments
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Container className="d-flex flex-column" id="item-list">
        {items.length > 0 ? (
          items.map((item) => <OrderItemCard key={item.id} orderItem={item} />)
        ) : (
          <div className="text-center h2">No items in this order.</div>
        )}
      </Container>

      <SearchModal />
      <TipModal />
    </main>
  );
}
