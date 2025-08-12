'use client';

import React, {useEffect} from "react";
import {GetOrderResponse} from "@/lib/gen/models";
import {OrdersApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import AdminOrderCard from "@/components/ui/admin/AdminOrderCard";
import {useRouter} from "next/navigation";

export default function OrdersPage(): React.JSX.Element {
    const [selectValue, setSelectValue] = React.useState("");
    const [orders, setOrders] = React.useState<Array<GetOrderResponse>>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const router = useRouter();

    const openHandler = (order: GetOrderResponse): void => {
        router.push(`/orders/${order.id}`);
    }

    const fetchOrders = async () => {
        setLoading(true);
        const client = new OrdersApi(Config);
        try {
            const data = await client.getOrders({status: selectValue});
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("An error occurred while fetching orders. Please try again later.");
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="flex-fill tabs">
            <div className="container d-flex">
                <select className="form-select me-3 w-100" id="order-status-select" aria-label="Status select"
                        value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                    <option value="">All</option>
                    <option value="closed">Closed</option>
                    <option value="open">Open</option>
                </select>
                <button className="btn btn-outline-primary" onClick={fetchOrders}>Refresh</button>
            </div>

            <div className="container d-flex flex-column">
                <div className="table-responsive mt-3">
                    <table className="table table-striped mw-100 table-hover" id="orders-list">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col" className="text-center">Table Number</th>
                            <th scope="col" className="text-center">Customer ID</th>
                            <th scope="col" className="text-center">Status</th>
                            <th scope="col" className="text-center">Ordered At</th>
                            <th scope="col" className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center">Loading...</td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order, index) => (
                                <AdminOrderCard key={index} onClick={openHandler} order={order}/>))) : (
                            <tr>
                                <td colSpan={6} className="text-center">No orders found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}