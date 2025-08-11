import {GetItemResponse, GetOrderItemResponse} from "@/lib/gen/models";
import React, {useState} from "react";
import {ItemsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";

export default function PendingItemCard({orderItem, onClick}: {orderItem: GetOrderItemResponse, onClick: (item: GetOrderItemResponse) => void}): React.JSX.Element {
    const [item, setItem] = useState<GetItemResponse>({});
    const [loading, setLoading] = useState<boolean>(true);

    React.useEffect(() => {
        (async () => {
            const client = new ItemsApi(Config);
            try {
                const fetchedItem = await client.getItemById({id: orderItem.itemId || 0});
                setItem(fetchedItem);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching item:", error);
                setLoading(false);
            }
        })();
    }, [orderItem.itemId]);

    if (loading) {
        return (
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <h1 className="text-center">Loading Item...</h1>
            </div>
        );
    }

    return (
        <div className="border p-4 me-3 mb-3 rounded-3 d-flex bg-body-tertiary shadow">
            <h4 className="text-center me-3">{`${orderItem.quantity} x ${item.name}`}</h4>
            <h4 className="text-center me-3 flex-fill">{orderItem.customInstructions}</h4>
            <div className="h-100 align-content-center">
                <button type="button" className="btn btn-success" onClick={() => onClick(item)}>Mark as
                    completed
                </button>
            </div>
        </div>
    )
}