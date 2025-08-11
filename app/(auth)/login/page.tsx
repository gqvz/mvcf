'use client';

import React from "react";
import {useRouter} from "next/navigation";
import {AuthenticationApi} from "@/lib/gen/apis";
import {ResponseError} from "@/lib/gen/runtime";
import Config from "@/lib/config";

export default function LoginPage(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const client = new AuthenticationApi(Config);
        try {
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
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 401) {
                    alert("Invalid username or password");
                } else {
                    alert("An error occurred while trying to log in. Please try again later.");
                }
            }
        }
    }

    const handleSignupButton = () => {
        router.push("/signup")
    }

    return (
        <><h1 className="text-center mb-4">Login to MVC</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 form-floating">
                    <input type="text"
                           className="form-control"
                           autoComplete="email"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           id="input-name"
                           placeholder="Name"
                           required/>
                    <label htmlFor="input-name">Username</label>
                </div>
                <div className="mb-3 form-floating">
                    <input type="password"
                           autoComplete="current-password"
                           className="form-control"
                           id="input-password"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="input-password">Password</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <hr/>
            <button type={"button"} className="btn btn-primary w-100" onClick={handleSignupButton}>
                I don't have an account
            </button>
        </>
    );
}