'use client';

import React, { useEffect } from 'react';
import { GetUserResponse, Role } from '@/lib/gen/models';
import Config from '@/lib/config';
import { UsersApi } from '@/lib/gen/apis';
import { Button, Container, Form, Table } from 'react-bootstrap';

export default function UsersPage(): React.JSX.Element {
  const [users, setUsers] = React.useState<Array<GetUserResponse>>([]);
  const [loading, setLoading] = React.useState(true);
  const [roleValue, setRoleValue] = React.useState<number>(Role.Any);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const fetchUsers = async () => {
    setLoading(true);
    const client = new UsersApi(Config);
    const response = await client.getUsers({ search: searchQuery, role: roleValue.toString() });
    setUsers(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex-fill tabs">
      <div>
        <Container className="d-flex">
          <Form.Select
            className="me-3 w-25"
            id="user-role-select"
            aria-label="Role select"
            value={roleValue}
            onChange={(e) => setRoleValue(parseInt(e.target.value) || 0)}
          >
            <option value={Role.Any}>All</option>
            <option value={Role.Customer}>Customer</option>
            <option value={Role.Chef}>Chef</option>
            <option value={Role.Admin}>Admin</option>
          </Form.Select>
          <Form.Control
            type="text"
            id="user-search"
            className="flex-fill me-3"
            placeholder="Search Users"
            aria-label="User Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-primary" onClick={fetchUsers}>
            Search
          </Button>
        </Container>
        <Container className="d-flex flex-column">
          <div className="table-responsive mt-3">
            <Table striped hover className="mw-100" id="user-list">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col" className="text-center">
                    Name
                  </th>
                  <th scope="col" className="text-center">
                    Email
                  </th>
                  <th scope="col" className="text-end">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="text-center">{user.name}</td>
                      <td className="text-center">{user.email}</td>
                      <td className="text-end">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </div>
  );
}
