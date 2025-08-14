import { GetRequestResponse, GetUserResponse, RequestStatus } from '@/lib/gen/models';
import React from 'react';
import { Button } from 'react-bootstrap';
import { UsersApi } from '@/lib/gen/apis';
import Config from '@/lib/config';

export default function AdminRequestCard({
  request,
  onAction
}: {
  request: GetRequestResponse;
  onAction: (request: GetRequestResponse, onAction: 'granted' | 'rejected') => Promise<void>;
}): React.JSX.Element {
  const [user, setUser] = React.useState<GetUserResponse>({});

  React.useEffect(() => {
    const fetchUser = async () => {
      const client = new UsersApi(Config);
      const response = await client.getUserById({ id: request.userId || 0 });
      setUser(response);
    };
    fetchUser();
  }, [request.userId]);

  return (
    <tr>
      <td>{request.id}</td>
      <td className="text-center">{request.userId}</td>
      <td className="text-center">{user.email || 'Loading...'}</td>
      <td className="text-center">{request.status}</td>
      <td className="text-center">{request.role}</td>
      <td className="text-end">
        {request.status === RequestStatus.Pending ? (
          <>
            <Button variant="success" className="me-2" onClick={() => onAction(request, 'granted')}>
              Grant
            </Button>
            <Button variant="danger" onClick={() => onAction(request, 'rejected')}>
              Reject
            </Button>
          </>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
}
