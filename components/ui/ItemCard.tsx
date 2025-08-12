import {GetItemResponse} from "@/lib/gen/models";
import React from "react";

export default function ItemCard({item, onClick}: { item: GetItemResponse, onClick: ((item: GetItemResponse) => void) | undefined }): React.JSX.Element {
    return (
        <div className="border p-4 me-3 mb-3 rounded-3 bg-body-tertiary shadow" role={onClick === undefined ? "none" : "button"} onClick={onClick ? () => onClick(item) : undefined}>
            <img src={item.imageUrl} className="img-fluid rounded-3 mb-3" style={{maxWidth: "300px"}}
                 alt={item.name}/>
            <h1 className="text-center mb-2"><code>{item.name}</code></h1>
            <div className="d-flex justify-content-center mb-3">
                {item.tags?.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-1">{tag.name}</span>
                ))}
            </div>
            <h4 className="text-center mb-3"> {item.description} </h4>
            <h4 className="text-center">Price: <code>${item.price}</code></h4>
        </div>
    )
}