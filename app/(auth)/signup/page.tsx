'use client';

import React from "react";
import {useRouter} from "next/navigation";
import {UsersApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {Form, Button} from "react-bootstrap";

export default function SignUpPage(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const client = new UsersApi(Config);
        await client.createUser({
            user: {
                password: password,
                email: email,
                name: username
            }
        })
        router.push("/login");
    }

    const handleLoginButton = () => {
        router.push("/login");
    }


    return (
        <>
            <h1 className="text-center mb-4">Signup</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control 
                        type="text"
                        autoComplete="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        id="input-name"
                        placeholder="Name"
                        required
                    />
                    <Form.Label htmlFor="input-name">Username</Form.Label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control 
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="input-email"
                        placeholder="Email"
                        required
                    />
                    <Form.Label htmlFor="input-email">Email</Form.Label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control 
                        type="password"
                        autoComplete="current-password"
                        id="input-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Label htmlFor="input-password">Password</Form.Label>
                </Form.Floating>
                <Button type="submit" variant="primary" className="w-100">Signup</Button>
            </Form>
            <hr/>
            <Button type="button" variant="primary" className="w-100" onClick={handleLoginButton}>
                I already have an account
            </Button>
        </>
    )
}