'use client';

import React, { useEffect } from 'react';
import { ItemsApi, OrderItemsApi, OrdersApi, PaymentsApi, TagsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { GetItemResponse, GetOrderItemResponse, GetOrderResponse, GetTagResponse } from '@/lib/gen/models';
import { useParams, useRouter } from 'next/navigation';
import OrderItemCard from '@/components/ui/OrderItemCard';
import Link from 'next/link';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import ItemCard from '@/components/ui/ItemCard';

export default function OrderPage(): React.JSX.Element {
  const router = useRouter();

  const id = parseInt((useParams().id as string) || 'NaN');

  const [loading, setLoading] = React.useState<boolean>(true);
  const [order, setOrder] = React.useState<GetOrderResponse>({});
  const [items, setItems] = React.useState<Array<GetOrderItemResponse>>([]);
  const [showSearchModal, setShowSearchModal] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [searchList, setSearchList] = React.useState<Array<GetItemResponse>>([]);
  const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);
  const [selectedTags, setSelectedTags] = React.useState<Array<number>>([]);
  const [searchLoading, setSearchLoading] = React.useState<boolean>(true);
  const [showTipModal, setShowTipModal] = React.useState<boolean>(false);
  const [tip, setTip] = React.useState<number>(0);
  const [showOrderItemModal, setShowOrderItemModal] = React.useState<boolean>(false);
  const [customInstructions, setCustomInstructions] = React.useState<string>('');
  const [itemCount, setItemCount] = React.useState<number>(1);
  const [selectedItemId, setSelectedItemId] = React.useState<number>(0);

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
    setShowTipModal(true);
  };

  const closeOrder = async () => {
    const client = new OrdersApi(Config);
    const paymentsClient = new PaymentsApi(Config);
    await client.closeOrderById({ id: order.id || 0 });
    setShowTipModal(false);
    alert('Order closed');
    const response = await paymentsClient.createPayment({
      request: {
        orderId: order.id,
        cashierId: order.customerId,
        tip: tip
      }
    });
    router.push('/payments');
  };

  const addItemHandler = async () => {
    const orderItemsClient = new OrderItemsApi(Config);
    const resp = await orderItemsClient.createOrderItem({
      id: order?.id || 0,
      request: { itemId: selectedItemId, customInstructions: customInstructions, quantity: itemCount }
    });
    alert('Item added');
    const orderItems = await orderItemsClient.getOrderItems({ id: order.id || 0 });
    setItems(orderItems);
    setShowOrderItemModal(false);
    setCustomInstructions('');
    setItemCount(1);
    setSelectedItemId(0);
  };

  const searchItems = async () => {
    setSearchLoading(true);
    const itemsClient = new ItemsApi(Config);
    const response = await itemsClient.getItems({
      search: searchValue,
      tags: selectedTags.map((t) => tags[t].name).join(',')
    });
    setSearchList(response);
    setSearchLoading(false);
  };

  const handleOrderItem = (item: GetItemResponse) => {
    setShowSearchModal(false);
    setShowOrderItemModal(true);
    setSelectedItemId(item.id || 0);
    setCustomInstructions('');
    setItemCount(1);
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
              <Button variant="primary" className="me-2" onClick={() => setShowSearchModal(true)}>
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

      <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            className="mb-3"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="mb-3 d-flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Button
                key={index}
                variant={selectedTags.includes(index) ? 'primary' : 'secondary'}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(index) ? prev.filter((t) => t !== index) : [...prev, index]
                  );
                }}
              >
                {tag.name}
              </Button>
            ))}
          </div>
          <hr />
          <div className="d-flex justify-content-center align-items-center mb-3">
            {searchLoading ? (
              <div className="text-center h4">Loading...</div>
            ) : searchList.length === 0 ? (
              <div className="text-center h4">No items found.</div>
            ) : (
              searchList.map((item, index) => <ItemCard key={index} item={item} onClick={handleOrderItem} />)
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={searchItems}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTipModal} onHide={() => setShowTipModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title id="tipModalLabel">Select tip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Range
            id="tip"
            min={0}
            max={100}
            step={5}
            value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
          />
          <h1 className="text-center">
            <code id="tipPercentText">${tip}</code>
          </h1>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTipModal(false)}>
            Close
          </Button>
          <Button variant="primary" id="confirm-tip-button" onClick={closeOrder}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOrderItemModal} onHide={() => setShowOrderItemModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title id="addItemModalLabel">Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            className="mb-3"
            placeholder="Add custom instructions"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            id="customInstructions"
          />
          <Form.Control
            type="number"
            className="mb-3"
            placeholder="Count"
            value={itemCount}
            min={1}
            step={1}
            onChange={(e) => setItemCount(Number(e.target.value))}
            id="itemCount"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderItemModal(false)}>
            Close
          </Button>
          <Button variant="primary" id="add-button" onClick={addItemHandler} disabled={itemCount < 1}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
