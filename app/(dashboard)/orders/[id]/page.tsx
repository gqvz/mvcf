'use client';

import React, {Usable, useEffect} from "react";
import {OrderItemsApi, OrdersApi, PaymentsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {GetOrderItemResponse, GetOrderResponse} from "@/lib/gen/models";
import {ResponseError} from "@/lib/gen/runtime";
import {useRouter} from "next/navigation";
import OrderItemCard from "@/components/ui/OrderItemCard";
import Link from "next/link";

export default function OrderPage({params}: { params: Usable<{ id: number }> }): React.JSX.Element {
    const router = useRouter();

    const {id} = React.use<{ id: number }>(params);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [order, setOrder] = React.useState<GetOrderResponse>({});
    const [items, setItems] = React.useState<Array<GetOrderItemResponse>>([]);

    useEffect(() => {
        const ordersClient = new OrdersApi(Config);
        const orderItems = new OrderItemsApi(Config);
        (async () => {
            try {
                const orderPromise = ordersClient.getOrderById({id: id});
                const itemsPromise = orderItems.getOrderItems({id: id});
                const [orderResponse, itemsResponse] = await Promise.all([orderPromise, itemsPromise]);
                setItems(itemsResponse);
                setOrder(orderResponse);
                setLoading(false);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401) {
                        alert("Unauthorized access. Please log in again.");
                        router.push("/login");
                    } else if (responseCode === 403) {
                        alert("You do not have permission to view this order.");
                        router.push("/orders")
                    } else if (responseCode === 404) {
                        alert("Order not found. Please check the order ID and try again.");
                        router.push("/orders");
                    } else {
                        console.error("Error fetching order:", error);
                        alert("An error occurred while fetching the order. Please try again later.");
                    }
                }
            }
        })();
    }, []);

    const closeOrderHandler = async () => {
        const client = new OrdersApi(Config);
        const paymentsClient = new PaymentsApi(Config);
        try {
            await client.closeOrderById({id: order.id || 0});
            alert("Order closed successfully.");
            const response = await paymentsClient.createPayment({request: {orderId: order.id, cashierId: order.customerId}});
            router.push("/payments");
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 401) {
                    alert("Unauthorized access. Please log in again.");
                    router.push("/login");
                } else if (responseCode === 403) {
                    alert("You do not have permission to close this order.");
                } else if (responseCode === 404) {
                    alert("Order not found. Please check the order ID and try again.");
                    router.push("/orders");
                } else {
                    console.error("Error closing order:", error);
                    alert("An error occurred while closing the order. Please try again later.");
                }
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    const addItemHandler = async () => {

    }

    if (loading) {
        return (
            <main className="flex-fill mt-3 d-flex flex-column">
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <h1 className="text-center">Loading Order...</h1>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-fill mt-3 d-flex flex-column">
            <div>
                <h1 className="text-center mb-2"> Order <code>#{order.id}</code></h1>
                <h4 className="text-center mb-1"> Ordered: <code>{order.orderedAt}</code></h4>
                <h4 className="text-center mb-1"> Table number: <code>{order.tableNumber}</code></h4>
                <h4 className="text-center mb-1"> Status: <code>{order.status}</code></h4>
            </div>
            <div id="buttons" className="mb-4">
                <div className="d-flex justify-content-center mt-3">
                    {order.status === "open" ? (
                        <>
                            <button className="btn btn-primary me-2" onClick={addItemHandler}>Add Item</button>
                            <button className="btn btn-primary me-2" onClick={closeOrderHandler}>Close Order</button>
                        </>
                    ) : (
                        <>
                            <Link href={"/orders"}>
                                <button className="btn btn-secondary me-2">Back to orders</button>
                            </Link>
                            <Link href={"/payments"}>
                                <button className="btn btn-primary me-2">Go to payments</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="container d-flex flex-column" id="item-list">
                {items.length > 0 ? (
                    items.map((item) => (
                        <OrderItemCard key={item.id} orderItem={item}/>
                    ))
                ) : (
                    <div className="text-center h2">No items in this order.</div>
                )
                }
            </div>
        </main>
    );
}