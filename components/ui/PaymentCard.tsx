import {GetPaymentResponse} from "@/lib/gen/models";
import React from "react";
import Link from "next/link";

export default function PaymentCard({payment}: { payment: GetPaymentResponse }): React.JSX.Element {
    return (
        <div className="border p-4 me-3 mb-3 rounded-3 bg-body-tertiary shadow">
            <h1 className="text-center mb-3">Payment <code>#{payment.id}</code></h1>
            <hr/>
            <h4 className="text-center mb-3"> Status: <code>{payment.status}</code></h4>
            <Link href={"/orders/" + payment.orderId}>
                <h4 className="text-center mb-3"> Order: <code>#{payment.orderId}</code></h4>
            </Link>
            <h4 className="text-center mb-3"> Tip: <code>${payment.tip}</code></h4>
            <h4 className="text-center mb-3"> Subtotal: <code>${payment.subtotal}</code></h4>
            <h4 className="text-center"> Total: <code>${payment.total}</code></h4>
        </div>
    )
}
