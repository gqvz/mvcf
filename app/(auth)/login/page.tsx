'use client';

import React from "react";
import {useRouter} from "next/navigation";
import {AuthenticationApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {Form, Button} from "react-bootstrap";

export default function LoginPage(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const client = new AuthenticationApi(Config);
        const response = await client.createToken({credentials: {username: username, password: password}});
        const token = response.token || "";
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload)) as { user_id: number; role: number; };
        const userId = decodedPayload.user_id;
        const role = decodedPayload.role;

        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("role", role.toString());
        localStorage.setItem("token", token);

        router.push("/")
    }

    const handleSignupButton = () => {
        router.push("/signup")
    }

    return (
        <>
            <h1 className="text-center mb-4">Login to MVC</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control 
                        type="text"
                        autoComplete="email"
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
                        type="password"
                        autoComplete="current-password"
                        id="input-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Label htmlFor="input-password">Password</Form.Label>
                </Form.Floating>
                <Button type="submit" variant="primary" className="w-100">Login</Button>
            </Form>
            <hr/>
            <Button type="button" variant="primary" className="w-100" onClick={handleSignupButton}>
                I don't have an account
            </Button>
        </>
    );
}