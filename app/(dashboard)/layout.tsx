'use client';

import React from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element {
    return (
        <>
            <Navbar/>
            {children}
        </>
    );
}
