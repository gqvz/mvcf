'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {UsersApi} from "@/lib/gen/apis";
import {Role} from "@/lib/gen/models";
import {ResponseError} from "@/lib/gen/runtime";
import Config from "@/lib/config";

export default function Navbar(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('Loading...');
    const [role, setRole] = React.useState<number>(0);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

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

    const signOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        router.push("/login");
    };

    const changeRoles = async () => {
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
                            <button className="btn btn-outline-secondary me-3" onClick={changeRoles}>Change roles
                            </button>
                            <button className="btn btn-outline-danger" type="button" onClick={signOut}>Logout</button>
                        </div>
                    </div>
                </div>

                {/*<div className="modal" id="role-modal" tabIndex={-1}>*/}
                {/*    <div className="modal-dialog">*/}
                {/*        <div className="modal-content">*/}
                {/*            <div className="modal-header">*/}
                {/*                <h5 className="modal-title">Request Role change</h5>*/}
                {/*                <button type="button" className="btn-close" data-bs-dismiss="modal"*/}
                {/*                        aria-label="Close"></button>*/}
                {/*            </div>*/}
                {/*            <div className="modal-body">*/}
                {/*                <select className="form-select mt-2" id="request-role" aria-label="Role select">*/}
                {/*                    <option value="customer">Customer</option>*/}
                {/*                    <option value="chef">Chef</option>*/}
                {/*                    <option value="admin">Admin</option>*/}
                {/*                </select>*/}
                {/*            </div>*/}
                {/*            <div className="modal-footer">*/}
                {/*                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close*/}
                {/*                </button>*/}
                {/*                <button type="button" className="btn btn-primary">Request Role Change</button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </nav>
        </>
    );
}