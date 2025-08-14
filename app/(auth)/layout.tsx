import React from "react";
import {Container} from "react-bootstrap";

export default function AuthLayout({children}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element {
    return (
        <Container className="flex-fill align-content-center justify-content-center" style={{maxWidth: '400px'}}>
            <main className="border p-4 rounded-3 bg-body-tertiary shadoow">
                {children}
            </main>
        </Container>
    )
}