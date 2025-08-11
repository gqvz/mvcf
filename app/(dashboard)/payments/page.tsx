'use client';

import React, {useEffect} from "react";
import {GetPaymentResponse} from "@/lib/gen/models";
import {PaymentsApi} from "@/lib/gen/apis";
import {useRouter} from "next/navigation";
import {ResponseError} from "@/lib/gen/runtime";
import Config from "@/lib/config";
import PaymentCard from "@/components/ui/paymentCard";

export default function PaymentsPage(): React.JSX.Element {

    const router = useRouter();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [payments, setPayments] = React.useState<Array<GetPaymentResponse>>([]);

    useEffect(() => {
        (async () => {
            const client = new PaymentsApi(Config);
            try {
                const payments = await client.getPayments();
                setPayments(payments);
                setLoading(false);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401) {
                        alert("Unauthorized access. Please log in again.");
                        router.push("/login");
                    } else {
                        console.error("Error fetching payments:", error);
                        alert("An error occurred while fetching payments. Please try again later.");
                    }
                } else {
                    console.error("Unexpected error:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }

        })()
    }, [])

    const handlePaymentClick = (payment: GetPaymentResponse): void => {
        router.push(`/payments/${payment.id}`);
    }

    return (
        <div id="payments-list"
             className="container mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
            {loading ? (
                <div className="text-center h2">Loading...</div>
            ) : (
                payments.length > 0 ? (
                    payments.map((payment) => (
                        <PaymentCard key={payment.id} payment={payment} onClick={handlePaymentClick}/>
                    ))
                ) : (
                    <div className="text-center h2">No payments found.</div>
                ))
            }
        </div>
    )
}