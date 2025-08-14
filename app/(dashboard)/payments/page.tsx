'use client';

import React, {useEffect} from "react";
import {GetPaymentResponse} from "@/lib/gen/models";
import {PaymentsApi} from "@/lib/gen/apis";
import {useRouter} from "next/navigation";
import Config from "@/lib/config";
import PaymentCard from "@/components/ui/PaymentCard";
import {Container} from "react-bootstrap";

export default function PaymentsPage(): React.JSX.Element {

    const router = useRouter();

    const [loading, setLoading] = React.useState<boolean>(true);
    const [payments, setPayments] = React.useState<Array<GetPaymentResponse>>([]);

    useEffect(() => {
        (async () => {
            const client = new PaymentsApi(Config);
            const payments = await client.getPayments();
            setPayments(payments);
            setLoading(false);
        })()

    }, [])

    return (
        <Container id="payments-list" className="mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
            {loading ? (
                <div className="text-center h2">Loading...</div>
            ) : (
                payments.length > 0 ? (
                    payments.map((payment) => (
                        <PaymentCard key={payment.id} payment={payment}/>
                    ))
                ) : (
                    <div className="text-center h2">No payments found.</div>
                ))
            }
        </Container>
    )
}