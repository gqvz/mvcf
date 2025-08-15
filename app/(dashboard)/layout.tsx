'use client';

import React, { useEffect } from 'react';
import NavbarComponent from '@/components/Navbar';
import { GetRequestResponse, RequestStatus, UserSeenStatus } from '@/lib/gen/models';
import { RequestsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import NotificationModal from '@/components/modals/NotificationModal';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  const [showNotificationModal, setShowNotificationModal] = React.useState<boolean>(false);
  const [notifications, setNotifications] = React.useState<Array<GetRequestResponse>>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const client = new RequestsApi(Config);
      const response = await client.getRequests({ user: parseInt(localStorage.getItem('userId') || '') || 0 });
      const unseenNotifications = response.filter(
        (n) => n.userStatus === UserSeenStatus.Unseen && n.status !== RequestStatus.Pending
      );
      setNotifications(unseenNotifications);
      if (unseenNotifications.length > 0) {
        setShowNotificationModal(true);
      }
    };
    fetchNotifications();
  }, []);

  const onMarkAsRead = async (id: number) => {
    const client = new RequestsApi(Config);
    await client.markRequestSeen({ id: id });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, userStatus: UserSeenStatus.Seen } : n)));
  };

  return (
    <>
      <NavbarComponent />
      {children}

      <NotificationModal
        show={showNotificationModal}
        onHide={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
      />
    </>
  );
}
