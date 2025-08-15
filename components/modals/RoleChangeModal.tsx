'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Role } from '@/lib/gen/models';

interface RoleChangeModalProps {
  show: boolean;
  onHide: () => void;
  selectedRoles: number;
  onRoleToggle: (value: number) => void;
  onRequestRoleChange: () => void;
}

export default function RoleChangeModal({
  show,
  onHide,
  selectedRoles,
  onRoleToggle,
  onRequestRoleChange
}: RoleChangeModalProps): React.JSX.Element {
  const ROLE_VALUES = [
    { label: 'Customer', value: Role.Customer },
    { label: 'Chef', value: Role.Chef },
    { label: 'Admin', value: Role.Admin }
  ];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request Role change</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {ROLE_VALUES.map((role) => (
            <Form.Check
              key={role.value}
              type="checkbox"
              id={`role-checkbox-${role.value}`}
              label={role.label}
              checked={(selectedRoles & role.value) === role.value}
              onChange={() => onRoleToggle(role.value)}
              className="mb-2"
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onRequestRoleChange}>
          Request Role Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
