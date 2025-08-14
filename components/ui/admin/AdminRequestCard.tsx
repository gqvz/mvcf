import {GetRequestResponse, RequestStatus} from "@/lib/gen/models";
import React from "react";
import {Button} from "react-bootstrap";

export default function AdminRequestCard({request, onAction}: {
    request: GetRequestResponse,
    onAction: (request: GetRequestResponse, onAction: "granted" | "rejected") => Promise<void>
}): React.JSX.Element {
    return (
        <tr>
            <td>{request.id}</td>
            <td className="text-center">{request.userId}</td>
            <td className="text-center">{request.status}</td>
            <td className="text-center">{request.role}</td>
            <td className="text-end">
                {request.status === RequestStatus.Pending ?
                    (<>
                        <Button variant="success" className="me-2" onClick={() => onAction(request, "granted")}>Grant</Button>
                        <Button variant="danger" onClick={() => onAction(request, "rejected")}>Reject</Button>
                    </>)
                    : <></>
                }
            </td>
        </tr>
    );
}