'use client';

import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {OrdersApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {ResponseError} from "@/lib/gen/runtime";

export default function Home() {
    const router = useRouter();

    const [tableNumber, setTableNumber] = useState<number>(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const orderClient = new OrdersApi(Config);
        try {
            const response = await orderClient.createOrder({request: {tableNumber: tableNumber}});
            router.push("/orders/" + response.orderId);
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 400) {
                    alert("Invalid table number. Please enter a number between 1 and 100.");
                } else if (responseCode === 401) {
                    alert("Unauthorized access. Please log in again.");
                    router.push("/login");
                } else if (responseCode === 409) {
                    alert("An order for this table already exists.");
                } else {
                    alert("An error occurred while creating the order. Please try again later.");
                }
                return;
            }
            alert("An error occurred while creating the order. Please try again later.");
            return;
        }
    }

    const previousOrders = () => {
        router.push("/orders")
    }

    return (
        <main className="container d-flex flex-column flex-fill justify-content-center" style={{maxWidth: '400px'}}>
            <div
                className="container p-4 rounded-3 bg-body-tertiary justify-content-center align-content-center border shadow">
                <h1 className="text-center mb-3"> Welcome to MVC </h1>
                <div className="container">
                    <form className="form-floating" onSubmit={handleSubmit}>
                        <input type="number" min="1" max="100" step="1" className="form-control mb-3" id="tableNumber"
                               required value={tableNumber} onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}/>
                        <label htmlFor="tableNumber">
                            Table Number
                        </label>
                        <button type="submit" className="btn btn-primary w-100">Start Ordering</button>
                    </form>
                    <hr className=""/>
                    <button className="btn btn-primary w-100" onClick={previousOrders}> Previous Orders</button>
                </div>
            </div>
        </main>)
}