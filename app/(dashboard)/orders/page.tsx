'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {GetOrderResponse} from "@/lib/gen/models";
import OrderCard from "@/components/ui/orderCard";
import {OrdersApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {ResponseError} from "@/lib/gen/runtime";

export default function OrdersPage(): React.JSX.Element {
    const router = useRouter();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [orders, setOrders] = React.useState<Array<GetOrderResponse>>([]);

    useEffect(() => {
        (async () => {
            const client = new OrdersApi(Config);
            try {
                const orders = await client.getOrders();
                setOrders(orders);
                setLoading(false);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401) {
                        alert("Unauthorized access. Please log in again.");
                        router.push("/login");
                    } else {
                        console.error("Error fetching orders:", error);
                        alert("An error occurred while fetching orders. Please try again later.");
                    }
                } else {
                    console.error("Unexpected error:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }

        })()
    }, [])

    const handleOrderClick = (order: GetOrderResponse): void => {
        router.push(`/orders/${order.id}`);
    }

    return (
        <div id="orders-list"
             className="container mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
            {loading ? (
                <div className="text-center h2">Loading...</div>
            ) : (
                orders.length > 0 ? (
                    orders.map((order) => (
                        <OrderCard key={order.id} order={order} onClick={handleOrderClick}/>
                    ))
                ) : (
                    <div className="text-center h2">No orders found.</div>
                ))
            }
        </div>
    )
}