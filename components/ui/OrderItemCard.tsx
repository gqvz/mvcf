import {GetItemResponse, GetOrderItemResponse} from "@/lib/gen/models";
import React, {useEffect} from "react";
import {ItemsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {ResponseError} from "@/lib/gen/runtime";

export default function OrderItemCard({orderItem}: { orderItem: GetOrderItemResponse }): React.JSX.Element {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [item, setItem] = React.useState<GetItemResponse>({});

    useEffect(() => {
        const itemsClient = new ItemsApi(Config);
        (async () => {
            try {
                const itemResponse = await itemsClient.getItemById({id: orderItem.itemId || 0})
                setItem(itemResponse);
                setLoading(false);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401) {
                        alert("Unauthorized access. Please log in again.");
                    } else if (responseCode === 404) {
                        alert("Item not found. Please check the item ID and try again.");
                    } else {
                        console.error("Error fetching item:", error);
                        alert("An error occurred while fetching the item. Please try again later.");
                    }
                } else {
                    console.error("Unexpected error:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <h1 className="text-center">Loading Item...</h1>
            </div>
        );
    }

    return (
        <div className="container d-flex shadow p-4 rounded-3 bg-body-tertiary align-items-stretch mb-3">
            <div className="d-flex flex-column justify-content-between me-4">
                <img src={item.imageUrl} className="rounded-3 object-fit-cover w-100 h-100 object-fit-contain"
                     style={{maxHeight: 200}} alt="image"/>
            </div>
            <div className="d-flex flex-column flex-grow-1">
                <h1>{item.name}</h1>
                <div className="d-flex mb-1">
                    {item.tags?.map(tag =>
                        <code key={tag.id} className="p-1 shadow rounded-2 me-2 bg-body-secondary">{tag.name}</code>)
                    }
                </div>
                <h5>{item.description}</h5>
                <h5>{orderItem.customInstructions}</h5>
            </div>
            <h2 className="text-end pe-4 align-content-center">
                <code>{orderItem.quantity + ' x $' + item.price?.toFixed(2)}</code></h2>
        </div>
    );
}