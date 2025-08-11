'use client';

import React from "react";
import {useRouter} from "next/navigation";
import {UsersApi} from "@/lib/gen/apis";
import {ResponseError} from "@/lib/gen/runtime";
import Config from "@/lib/config";

export default function SignUpPage(): React.JSX.Element {
    const router = useRouter();

    const [username, setUsername] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const client = new UsersApi(Config);
        try {
            await client.createUser({
                user: {
                    password: password,
                    email: email,
                    name: username
                }
            })
            router.push("/login");
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 400) {
                    alert("Invalid input. Please check your data and try again.");
                } else if (responseCode === 409) {
                    alert("Username or email already exists. Please choose a different one.");
                } else {
                    alert("An error occurred while trying to sign up. Please try again later.");
                }
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    const handleLoginButton = () => {
        router.push("/login");
    }


    return (
        <><h1 className="text-center mb-4">Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 form-floating">
                    <input type="text"
                           className="form-control"
                           autoComplete="name"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           id="input-name"
                           placeholder="Name"
                           required/>
                    <label htmlFor="input-name">Username</label>
                </div>
                <div className="mb-3 form-floating">
                    <input type="email"
                           className="form-control"
                           autoComplete="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           id="input-email"
                           placeholder="Email"
                           required/>
                    <label htmlFor="input-email">Email</label>
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
                <button type="submit" className="btn btn-primary w-100">Signup</button>
            </form>
            <hr/>
            <button type={"button"} className="btn btn-primary w-100" onClick={handleLoginButton}>
                I already have an account
            </button>
        </>
    )
}