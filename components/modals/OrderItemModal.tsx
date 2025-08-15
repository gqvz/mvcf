'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useOrderItemModalStore } from '@/lib/stores/orderItemModalStore';

export default function OrderItemModal(): React.JSX.Element {
  const { show, customInstructions, itemCount, onAddItem, close, updateCustomInstructions, updateItemCount } =
    useOrderItemModalStore();
  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem();
    }
    close();
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title id="addItemModalLabel">Add Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          className="mb-3"
          placeholder="Add custom instructions"
          value={customInstructions}
          onChange={(e) => updateCustomInstructions(e.target.value)}
          id="customInstructions"
        />
        <Form.Control
          type="number"
          className="mb-3"
          placeholder="Count"
          value={itemCount}
          min={1}
          step={1}
          onChange={(e) => updateItemCount(Number(e.target.value))}
          id="itemCount"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" id="add-button" onClick={handleAddItem} disabled={itemCount < 1}>
          Add Item
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
