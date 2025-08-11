'use client';

import React, {useEffect} from "react";
import {GetOrderItemsByStatusRequest, GetOrderItemsRequest, OrderItemsApi} from "@/lib/gen/apis";
import {GetOrderItemResponse} from "@/lib/gen/models";
import PendingItemCard from "@/components/ui/pendingItemCard";
import Config from "@/lib/config";

export default function ChefPage(): React.JSX.Element {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pendingItems, setPendingItems] = React.useState<Array<GetOrderItemResponse>>([]);

    useEffect(() => {
        (async () => {
            const client = new OrderItemsApi(Config);
            try {
                const request: GetOrderItemsByStatusRequest = {status: "preparing"};
                const items = await client.getOrderItemsByStatus(request);
                setPendingItems(items);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching pending items:", error);
                alert("An error occurred while fetching pending items. Please try again later.");
                setLoading(false);
            }
        })();
    }, []);

    const handleMarkAsComplete = async (orderItem: GetOrderItemResponse) => {
        const client = new OrderItemsApi(Config);
        try {
            await client.editOrderItemStatus({id: orderItem.id || 0, status: {status: "completed"}});
            setPendingItems(prevItems => prevItems.filter(item => item.id !== orderItem.id));
        } catch (error) {
            console.error("Error marking item as complete:", error);
            alert("An error occurred while marking the item as complete. Please try again later.");
        }
    };

    return (
        <>
            <h1 className="text-center w-100 mt-3"> Pending Items </h1>
            <hr/>
            <div id="orders-list" className="container mt-3 d-flex flex-fill flex-wrap flex-column">
                {loading ? (
                    <h1 className="text-center">Loading</h1>
                ) : pendingItems.length > 0
                    ? pendingItems.map((item, index) => (
                        <PendingItemCard key={index} orderItem={item} onClick={handleMarkAsComplete}/>))
                    : <h1 className="text-center">No pending items</h1>}
            </div>
        </>
    );
}