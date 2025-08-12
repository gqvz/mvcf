import {GetItemResponse} from "@/lib/gen/models";
import React from "react";

export function AdminItemCard({item, onClick}: {
    item: GetItemResponse,
    onClick: (item: GetItemResponse) => void
}): React.JSX.Element {
    return (
        <tr>
            <td>{item.id}</td>
            <td className="text-center">{item.name}</td>
            <td className="text-center">
                <img src={item.imageUrl} alt={item.name} className="img-thumbnail"
                     style={{maxWidth: "100px"}}/>
            </td>
            <td className="text-center">{item.description}</td>
            <td className="text-center">{item.tags?.map(t => t.name).join(', ')}</td>
            <td className="text-center">{item.price}</td>
            <td className="text-end">
                <button className="btn btn-sm btn-secondary" onClick={() => onClick(item)}>Edit Item</button>
            </td>
        </tr>
    );
}