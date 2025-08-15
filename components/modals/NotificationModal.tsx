'use client';

import React from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { GetRequestResponse, RequestStatus, UserSeenStatus } from '@/lib/gen/models';

interface NotificationModalProps {
  show: boolean;
  onHide: () => void;
  notifications: Array<GetRequestResponse>;
  onMarkAsRead: (id: number) => void;
}

export default function NotificationModal({
  show,
  onHide,
  notifications,
  onMarkAsRead
}: NotificationModalProps): React.JSX.Element {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {notifications.map((n) => (
            <ListGroup.Item key={n.id} className="d-flex justify-content-between align-items-center">
              <span>
                {n.status === RequestStatus.Rejected
                  ? `Your role change request for ${n.role} was rejected`
                  : `Your role change request for ${n.role} was granted`}
              </span>
              {n.userStatus === UserSeenStatus.Unseen ? (
                <Button size="sm" variant="outline-success" onClick={() => onMarkAsRead(n.id || 0)}>
                  Mark as Read
                </Button>
              ) : (
                <></>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
