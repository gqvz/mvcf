'use client';

import React, {useEffect} from "react";
import {GetRequestResponse, RequestStatus} from "@/lib/gen/models";
import {RequestsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import AdminRequestCard from "@/components/ui/admin/AdminRequestCard";

export default function RequestsPage(): React.JSX.Element {
    const [status, setStatus] = React.useState<string>("");
    const [requests, setRequests] = React.useState<Array<GetRequestResponse>>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const client = new RequestsApi(Config);

        try {
            const requests = await client.getRequests({status: status});
            setRequests(requests);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests:", error);
            alert("An error occurred while fetching requests. Please try again later.");
        }
    };

    const handleAction = async (request: GetRequestResponse, action: "granted" | "rejected") => {
        const client = new RequestsApi(Config);
        try {
            if (action === "granted") {
                await client.grantRequest({id: request.id || 0});
                alert("Request granted successfully.");
            } else if (action === "rejected") {
                await client.rejectRequest({id: request.id || 0});
                alert("Request rejected successfully.");
            }
            await fetchRequests();
        } catch (error) {
            console.error("Error handling request action:", error);
            alert("An error occurred while processing the request. Please try again later.");
        }
    }

    return (
        <div className="flex-fill tabs">
            <div>
                <div className="container d-flex">
                    <select className="form-select me-3 flex-fill" id="request-status-select" aria-label="Status select"
                            value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value={RequestStatus.Pending}>Pending</option>
                        <option value={RequestStatus.Rejected}>Rejected</option>
                        <option value={RequestStatus.Granted}>Granted</option>
                    </select>
                    <button className="btn btn-outline-primary" onClick={fetchRequests}>Search</button>
                </div>
                <div className="container d-flex flex-column">
                    <div className="table-responsive mt-3">
                        <table className="table table-striped mw-100 table-hover" id="request-list">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center">UserID</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Role requested</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                            </thead>
                            {loading ? (
                                <tbody>
                                <tr>
                                    <td colSpan={5} className="text-center">Loading...</td>
                                </tr>
                                </tbody>
                            ) : requests.length > 0 ? (
                                <tbody>
                                {requests.map((request, index) => (
                                    <AdminRequestCard onAction={handleAction} request={request} key={index}/>))}
                                </tbody>
                            ) : (
                                <tbody>
                                <tr>
                                    <td colSpan={5} className="text-center">No requests found</td>
                                </tr>
                                </tbody>
                            )}
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}