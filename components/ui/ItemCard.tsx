import {GetItemResponse} from "@/lib/gen/models";
import React from "react";
import {Card, Badge} from "react-bootstrap";

export default function ItemCard({item, onClick}: { item: GetItemResponse, onClick: ((item: GetItemResponse) => void) | undefined }): React.JSX.Element {
    return (
        <Card 
            className="me-3 mb-3 shadow" 
            role={onClick === undefined ? "none" : "button"} 
            onClick={onClick ? () => onClick(item) : undefined}
            style={{cursor: onClick ? 'pointer' : 'default'}}
        >
            <Card.Img variant="top" src={item.imageUrl} style={{maxWidth: "300px"}} alt={item.name}/>
            <Card.Body>
                <Card.Title className="text-center mb-2"><code>{item.name}</code></Card.Title>
                <div className="d-flex justify-content-center mb-3">
                    {item.tags?.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1">{tag.name}</Badge>
                    ))}
                </div>
                <Card.Text className="text-center mb-3"> {item.description} </Card.Text>
                <Card.Text className="text-center">Price: <code>${item.price}</code></Card.Text>
            </Card.Body>
        </Card>
    )
}