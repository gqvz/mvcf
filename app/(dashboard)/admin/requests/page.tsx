'use client';

import React, {useEffect} from "react";
import {GetRequestResponse, RequestStatus} from "@/lib/gen/models";
import {RequestsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import AdminRequestCard from "@/components/ui/admin/AdminRequestCard";
import {Container, Form, Button, Table} from "react-bootstrap";

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

        const requests = await client.getRequests({status: status});
        setRequests(requests);
        setLoading(false);
    };

    const handleAction = async (request: GetRequestResponse, action: "granted" | "rejected") => {
        const client = new RequestsApi(Config);
        if (action === "granted") {
            await client.grantRequest({id: request.id || 0});
        } else if (action === "rejected") {
            await client.rejectRequest({id: request.id || 0});
        }
        await fetchRequests();
    }

    return (
        <div className="flex-fill tabs">
            <div>
                <Container className="d-flex">
                    <Form.Select 
                        className="me-3 flex-fill" 
                        id="request-status-select" 
                        aria-label="Status select"
                        value={status} 
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value={RequestStatus.Pending}>Pending</option>
                        <option value={RequestStatus.Rejected}>Rejected</option>
                        <option value={RequestStatus.Granted}>Granted</option>
                    </Form.Select>
                    <Button variant="outline-primary" onClick={fetchRequests}>Search</Button>
                </Container>
                <Container className="d-flex flex-column">
                    <div className="table-responsive mt-3">
                        <Table striped hover className="mw-100" id="request-list">
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
                        </Table>
                    </div>
                </Container>
            </div>
        </div>
    );
}