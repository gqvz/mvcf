import React from "react";

export default function AuthLayout({children}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element {
    return (
        <div className="container flex-fill align-content-center justify-content-center" style={{maxWidth: '400px'}}>
            <main className="border p-4 rounded-3 bg-body-tertiary shadoow">
                {children}
            </main>
        </div>
    )
}