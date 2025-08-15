'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useItemModalStore } from '@/lib/stores/itemModalStore';

export default function ItemModal(): React.JSX.Element {
  const { show, mode, item, tags, onSave, close, updateItem } = useItemModalStore();

  const isCreate = mode === 'create';
  const prefix = isCreate ? 'create' : 'edit';
  const title = isCreate ? 'Create Item' : 'Edit Item';

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
            id={`${prefix}-item-name`}
            placeholder="Name"
            value={item.name}
            onChange={(e) => updateItem({ ...item, name: e.target.value })}
          />
          <Form.Label htmlFor={`${prefix}-item-name`}>Name</Form.Label>
        </Form.Floating>
        <Form.Floating>
          <Form.Control
            type="email"
            className="mt-2"
            id={`${prefix}-item-image`}
            value={item.imageUrl}
            onChange={(e) => updateItem({ ...item, imageUrl: e.target.value })}
            placeholder="Image"
          />
          <Form.Label htmlFor={`${prefix}-item-image`}>Image URL</Form.Label>
        </Form.Floating>
        <Form.Floating>
          <Form.Control
            type="text"
            className="mt-2"
            id={`${prefix}-item-description`}
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem({ ...item, description: e.target.value })}
          />
          <Form.Label htmlFor={`${prefix}-item-description`}>Description</Form.Label>
        </Form.Floating>
        <Form.Floating>
          <Form.Control
            type="number"
            className="mt-2"
            id={`${prefix}-item-price`}
            value={item.price}
            onChange={(e) => updateItem({ ...item, price: parseInt(e.target.value) || 0 })}
            placeholder="Price"
            min="0"
          />
          <Form.Label htmlFor={`${prefix}-item-price`}>Price</Form.Label>
        </Form.Floating>
        <Form.Label htmlFor={`${prefix}-item-available`}>Available: </Form.Label>
        <Form.Check
          inline
          className="mt-3"
          id={`${prefix}-item-available`}
          checked={item.available}
          onChange={(e) => updateItem({ ...item, available: e.target.checked })}
        />
        <div className="mt-3" id={`${prefix}-item-tags`}>
          {tags.map((tag, index) => (
            <Form.Check
              key={index}
              inline
              type="checkbox"
              id={`${prefix}-item-tag-${tag.id}`}
              checked={item.tags?.some((t) => t.id === tag.id)}
              onChange={() => {
                const tags = item.tags || [];
                if (tags.some((t) => t.id === tag.id)) {
                  updateItem({ ...item, tags: tags.filter((t) => t.id !== tag.id) });
                } else {
                  updateItem({ ...item, tags: [...tags, tag] });
                }
              }}
              label={tag.name}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={
            item.name?.trim() === '' ||
            item.price === undefined ||
            item.price <= 0 ||
            item.description?.trim() === '' ||
            item.imageUrl?.trim() === ''
          }
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
