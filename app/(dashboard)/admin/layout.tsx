'use client';

import React from "react";
import {Button} from "react-bootstrap";

export default function AdminLayout({children}: Readonly<{children: React.ReactNode;}>): React.JSX.Element {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <Button/>
                    {/* Sidebar can be added here */}
                </div>
                <div className="col-md-9">
                    {children}
                </div>
            </div>
        </div>
    );
}