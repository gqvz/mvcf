'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTagModalStore } from '@/lib/stores/tagModalStore';

export default function TagModal(): React.JSX.Element {
  const { show, mode, tagName, onSave, close, updateTagName } = useTagModalStore();

  const title = mode === 'create' ? 'Create Tag' : 'Edit Tag';

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    close();
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Floating>
          <Form.Control
            type="text"
            value={tagName}
            onChange={(e) => updateTagName(e.target.value)}
            id="tag-name"
            placeholder="Tag Name"
          />
          <Form.Label htmlFor="tag-name">Tag Name</Form.Label>
        </Form.Floating>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={tagName.trim() === ''}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
