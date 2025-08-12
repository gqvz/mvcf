'use client';

import React from "react";
import {GetOrderResponse} from "@/lib/gen/models";

export interface OrderCardProps {
    order: GetOrderResponse;
    onClick: (order: GetOrderResponse) => void;
}

export default function OrderCard(props: OrderCardProps): React.JSX.Element {
    return (
        <div role="button" onClick={() => props.onClick(props.order)}
             className="border p-4 me-3 mb-3 rounded-3 bg-body-tertiary shadow">
            <h1 className="text-center mb-3">Order <code>#{props.order.id}</code></h1>
            <hr/>
            <h4 className="text-center mb-3">Table Number: <code>{props.order.tableNumber}</code> </h4>
            <h4 className="text-center"> Ordered on <code>{props.order.orderedAt}</code></h4>
            <h4 className="text-center"> Status: <code>{props.order.status}</code></h4>
        </div>
    );
}