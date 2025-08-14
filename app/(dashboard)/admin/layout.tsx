'use client';

import React, { useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Role } from '@/lib/gen/models';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const roleS = localStorage.getItem('role');
    const role = parseInt(roleS || '0', 10);
    if ((role & Role.Admin) !== Role.Admin) {
      alert('You do not have permission to access this page.');
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <h1 className="w-100 text-center mt-3 mb-3">Admin Portal</h1>
      <ButtonGroup aria-label="tab" className={'container'}>
        <Button href={'/admin/orders'}>Orders</Button>
        <Button href={'/admin/payments'}>Payments</Button>
        <Button href={'/admin/items'}>Items</Button>
        <Button href={'/admin/tags'}>Tags</Button>
        <Button href={'/admin/users'}>Users</Button>
        <Button href={'/admin/requests'}>Requests</Button>
      </ButtonGroup>
      <hr />
      {children}
    </>
  );
}
