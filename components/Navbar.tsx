'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {RequestsApi, UsersApi} from "@/lib/gen/apis";
import {Role} from "@/lib/gen/models";
import Config from "@/lib/config";
import {Button, Form, Modal, Navbar, Container, Nav, } from "react-bootstrap";

export default function NavbarComponent(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('Loading...');
    const [role, setRole] = React.useState<number>(0);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [showRoleChangeModal, setShowRoleChangeModal] = React.useState<boolean>(false);
    const [selectedRoles, setSelectedRoles] = React.useState<number>(0);


    const ROLE_VALUES = [
        {label: "Customer", value: Role.Customer},
        {label: "Chef", value: Role.Chef},
        {label: "Admin", value: Role.Admin},
    ];

    useEffect(() => {
        setIsMounted(true);

        const roleString = localStorage.getItem('role');
        const userIdString = localStorage.getItem('userId');

        if (typeof roleString !== 'string' || typeof userIdString !== 'string') {
            router.push("/login");
            return;
        }

        const parsedRole = parseInt(roleString, 10) || 0;
        const parsedUserId = parseInt(userIdString, 10) || 0;

        setRole(parsedRole);

        const name = localStorage.getItem("username");

        const fetchData = async (id: number) => {
            const client = new UsersApi(Config);
            const response = await client.getUserById({id: id});
            setUsername(response.name || "");
        };

        if (!name) {
            fetchData(parsedUserId);
        } else {
            setUsername(name);
        }
    }, [router]);

    const handleCheckbox = (value: number) => {
        setSelectedRoles((prev) =>
            (prev & value) === value ? prev & ~value : prev | value
        );
    };

    const signOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        router.push("/login");
    };

    const changeRoles = async () => {
        const client = new RequestsApi(Config);
        await client.createRequest({request: {role: selectedRoles as Role}});
        setShowRoleChangeModal(false);
        alert("Request sent");
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="/">MVC</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarSupportedContent" />
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto mb-2 mb-lg-0">
                            <Nav.Link href="/orders" active>Orders</Nav.Link>
                            <Nav.Link href="/payments" active>Payments</Nav.Link>
                            <Nav.Link href="/menu" active>Menu</Nav.Link>
                            {isMounted && ((role & Role.Chef) == Role.Chef) &&
                                <Nav.Link href="/chef" active>Chef</Nav.Link>
                            }
                            {isMounted && ((role & Role.Admin) == Role.Admin) &&
                                <Nav.Link href="/admin" active>Admin</Nav.Link>
                            }
                        </Nav>
                        <div className="d-flex">
                            <span className="text-center align-content-center me-3">Hi, <code>{username}</code></span>
                            <Button variant="outline-secondary" className="me-3" onClick={() => setShowRoleChangeModal(true)}>Change roles</Button>
                            <Button variant="outline-danger" onClick={signOut}>Logout</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>

                <Modal show={showRoleChangeModal} onHide={() => setShowRoleChangeModal(false)} centered>
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
                                    onChange={() => handleCheckbox(role.value)}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRoleChangeModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={changeRoles}>
                            Request Role Change
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Navbar>
        </>
    );
}