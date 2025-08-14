'use client';

import React, {useEffect} from "react";
import {GetOrderItemsByStatusRequest, OrderItemsApi} from "@/lib/gen/apis";
import {GetOrderItemResponse} from "@/lib/gen/models";
import PendingItemCard from "@/components/ui/PendingItemCard";
import Config from "@/lib/config";
import {Container} from "react-bootstrap";

export default function ChefPage(): React.JSX.Element {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pendingItems, setPendingItems] = React.useState<Array<GetOrderItemResponse>>([]);

    useEffect(() => {
        (async () => {
            const client = new OrderItemsApi(Config);
            const request: GetOrderItemsByStatusRequest = {status: "preparing"};
            const items = await client.getOrderItemsByStatus(request);
            setPendingItems(items);
            setLoading(false);
        })();

    }, []);

    const handleMarkAsComplete = async (orderItem: GetOrderItemResponse) => {
        const client = new OrderItemsApi(Config);
        await client.editOrderItemStatus({id: orderItem.id || 0, status: {status: "completed"}});
        setPendingItems(prevItems => prevItems.filter(item => item.id !== orderItem.id));
    };

    return (
        <>
            <h1 className="text-center w-100 mt-3"> Pending Items </h1>
            <hr/>
            <Container id="orders-list" className="mt-3 d-flex flex-fill flex-wrap flex-column">
                {loading ? (
                    <h1 className="text-center">Loading</h1>
                ) : pendingItems.length > 0
                    ? pendingItems.map((item, index) => (
                        <PendingItemCard key={index} orderItem={item} onClick={handleMarkAsComplete}/>))
                    : <h1 className="text-center">No pending items</h1>}
            </Container>
        </>
    );
}