import {GetOrderResponse} from "@/lib/gen/models";
import React from "react";

export default function AdminOrderCard({order, onClick}: {
    order: GetOrderResponse,
    onClick: (order: GetOrderResponse) => void
}): React.JSX.Element {
    return (
        <tr>
            <td>{order.id}</td>
            <td className="text-center">{order.tableNumber}</td>
            <td className="text-center">{order.customerId}</td>
            <td className="text-center">{order.status}</td>
            <td className="text-center">{order.orderedAt}</td>
            <td className="text-end">
                <button className="btn btn-sm btn-secondary" onClick={() => onClick(order)}>Open</button>
            </td>
        </tr>
    );
}