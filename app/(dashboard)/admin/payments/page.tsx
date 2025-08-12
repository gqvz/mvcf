'use client';

import React, {useEffect} from "react";
import {GetPaymentResponse, PaymentStatus} from "@/lib/gen/models";
import Config from "@/lib/config";
import {PaymentsApi} from "@/lib/gen/apis";
import AdminPaymentCard from "@/components/ui/admin/AdminPaymentCard";

export default function PaymentsPage(): React.JSX.Element {
    const [selectValue, setSelectValue] = React.useState("");
    const [payments, setPayments] = React.useState<Array<GetPaymentResponse>>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchPayments = async () => {
        setLoading(true);
        const client = new PaymentsApi(Config);
        try {
            const response = await client.getPayments({status: selectValue});
            setPayments(response);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("An error occurred while fetching orders. Please try again later.");
        }
    }

    const handlePaymentStatusChange = async (payment: GetPaymentResponse) => {
        const client = new PaymentsApi(Config);
        try {
            if (payment.status === PaymentStatus.Processing) {
                await client.editPaymentStatus({id: payment.id || 0, request: {status: PaymentStatus.Accepted}});
                alert("Payment accepted successfully.");
            } else {
                await client.editPaymentStatus({id: payment.id || 0, request: {status: PaymentStatus.Processing}});
                alert("Payment rejected successfully.");
            }
            await fetchPayments();
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("An error occurred while updating payment status. Please try again later.");
        }
    }

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="flex-fill tabs">
            <div className="container d-flex">
                <select className="form-select me-3 w-100" id="payment-status-select" aria-label="Status select" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
                    <option value="">All</option>
                    <option value={PaymentStatus.Processing}>Processing</option>
                    <option value={PaymentStatus.Accepted}>Accepted</option>
                </select>
                <button className="btn btn-outline-primary" onClick={fetchPayments}>Refresh</button>
            </div>

            <div className="container d-flex flex-column">
                <div className="table-responsive mt-3">
                    <table className="table table-striped mw-100 table-hover" id="payment-list">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col" className="text-center">Order ID</th>
                            <th scope="col" className="text-center">Amount</th>
                            <th scope="col" className="text-center">Status</th>
                            <th scope="col" className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">Loading...</td>
                            </tr>
                        ) : payments.length > 0 ? (
                            payments.map((payment, index) => (<AdminPaymentCard key={index} payment={payment} onStatusChange={handlePaymentStatusChange} />))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">No payments found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}