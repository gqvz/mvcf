'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {RequestsApi, UsersApi} from "@/lib/gen/apis";
import {Role} from "@/lib/gen/models";
import {ResponseError} from "@/lib/gen/runtime";
import Config from "@/lib/config";
import {Button, Form, Modal} from "react-bootstrap";

export default function Navbar(): React.JSX.Element {
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
            try {
                const response = await client.getUserById({id: id});
                if (response.name === undefined || response.name === null) {
                    router.push("/login");
                    return;
                }
                setUsername(response.name);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401 || responseCode === 403) {
                        alert("Unauthorized access. Please log in again.");
                        router.push("/login");
                    } else {
                        console.error("Error fetching user data:", error);
                        alert("An error occurred while fetching user data. Please try again later.");
                    }
                } else {
                    console.error("Unexpected error:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }
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
        try {
            await client.createRequest({request: {role: selectedRoles}});
            setShowRoleChangeModal(false);
            alert("Role change request sent successfully.");
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 401 || responseCode === 403) {
                    alert("Unauthorized access. Please log in again.");
                    router.push("/login");
                } else {
                    console.error("Error requesting role change:", error);
                    alert("An error occurred while requesting role change. Please try again later.");
                }
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">MVC</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/orders">Orders</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/payments">Payments</a>
                            </li>
                            <li>
                                <a className="nav-link active" href="/menu">Menu</a>
                            </li>
                            {
                                isMounted && ((role & Role.Chef) == Role.Chef) &&
                                <li>
                                    <a className="nav-link active" href="/chef">Chef</a>
                                </li>
                            }
                            {
                                isMounted && ((role & Role.Admin) == Role.Admin) &&
                                <li>
                                    <a className="nav-link active" href="/admin">Admin</a>
                                </li>
                            }
                        </ul>
                        <div className="d-flex">
                            <span className="text-center align-content-center me-3">Hi, <code>{username}</code></span>
                            <button className="btn btn-outline-secondary me-3" onClick={() => setShowRoleChangeModal(true)}>Change roles
                            </button>
                            <button className="btn btn-outline-danger" type="button" onClick={signOut}>Logout</button>
                        </div>
                    </div>
                </div>

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

            </nav>
        </>
    );
}