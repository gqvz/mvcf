import {GetPaymentResponse, PaymentStatus} from "@/lib/gen/models";
import React from "react";

export default function AdminPaymentCard({payment, onStatusChange}: {
    payment: GetPaymentResponse,
    onStatusChange: (payment: GetPaymentResponse) => Promise<void>
}): React.JSX.Element {
    return (
        <tr>
            <td>{payment.id}</td>
            <td className="text-center">{payment.orderId}</td>
            <td className="text-center">${payment.total}</td>
            <td className="text-center">{payment.status}</td>
            <td className="text-end">
                <button className="btn btn-sm btn-secondary" onClick={async () => onStatusChange(payment)}>{payment.status == PaymentStatus.Accepted ? "Mark as Processing" : "Mark as Accepted"}
                </button>
            </td>
        </tr>
    )
}