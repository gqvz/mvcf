'use client';

import React, {useEffect} from "react";
import Navbar from "@/components/Navbar";
import {Button, Modal, ListGroup} from "react-bootstrap";
import {GetRequestResponse, RequestStatus, UserSeenStatus} from "@/lib/gen/models";
import {RequestsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element {
    const [showNotificationModal, setShowNotificationModal] = React.useState<boolean>(false);
    const [notifications, setNotifications] = React.useState<Array<GetRequestResponse>>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const client = new RequestsApi(Config);
            try {
                const response = await client.getRequests({user: parseInt(localStorage.getItem("userId") || "") || 0})
                const unseenNotifications = response.filter(n => n.userStatus === UserSeenStatus.Unseen && n.status !== RequestStatus.Pending);
                setNotifications(unseenNotifications);
                if (unseenNotifications.length > 0) {
                    setShowNotificationModal(true);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                alert("An error occurred while fetching notifications. Please try again later.");
            }
        }
        fetchNotifications();
    }, []);

    const onMarkAsRead = async (id: number) => {
        const client = new RequestsApi(Config);
        try {
            await client.markRequestSeen({id: id});
            setNotifications((prev) => prev.map(n => n.id === id ? {...n, userStatus: UserSeenStatus.Seen} : n));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            alert("An error occurred while marking the notification as read. Please try again later.");
        }
    }

    return (
        <>
            <Navbar/>
            {children}

            <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {notifications.map((n) => (
                            <ListGroup.Item
                                key={n.id}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{n.status === RequestStatus.Rejected ? `Your role change request for ${n.role} was rejected` : `Your role change request for ${n.role} was granted`}</span>
                                {n.userStatus === UserSeenStatus.Unseen ? (<Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => onMarkAsRead(n.id || 0)}
                                >
                                    Mark as Read
                                </Button>) : (<></>)}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
