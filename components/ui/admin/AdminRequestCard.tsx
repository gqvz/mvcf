import {GetRequestResponse, RequestStatus} from "@/lib/gen/models";
import React from "react";

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
                        <button className="btn btn-success me-2" onClick={() => onAction(request, "granted")}>Grant</button>
                        <button className="btn btn-danger" onClick={() => onAction(request, "rejected")}>Reject</button>
                    </>)
                    : <></>
                }
            </td>
        </tr>
    );
}