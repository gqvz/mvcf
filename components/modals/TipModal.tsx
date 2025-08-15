'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTipModalStore } from '@/lib/stores/tipModalStore';

export default function TipModal(): React.JSX.Element {
  const { show, tip, onConfirm, close, updateTip } = useTipModalStore();
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    close();
  };

  return (
    <Modal show={show} onHide={close} centered>
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
          onChange={(e) => updateTip(Number(e.target.value))}
        />
        <h1 className="text-center">
          <code id="tipPercentText">${tip}</code>
        </h1>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" id="confirm-tip-button" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
