import {GetTagResponse} from "@/lib/gen/models";
import React from "react";

export default function AdminTagCard({tag, onClick}: {
    tag: GetTagResponse,
    onClick: (tag: GetTagResponse) => void
}): React.JSX.Element {
    return (
        <tr>
            <td>{tag.id}</td>
            <td className="text-center">{tag.name}</td>
            <td className="text-end">
                <button className="btn btn-sm btn-secondary" onClick={() => onClick(tag)}>Edit Tag</button>
            </td>
        </tr>
    );
}