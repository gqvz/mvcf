'use client';

import React, {useEffect} from "react";
import {GetItemResponse, GetTagResponse} from "@/lib/gen/models";
import {ItemsApi, TagsApi} from "@/lib/gen/apis";
import Config from "@/lib/config";
import {AdminItemCard} from "@/components/ui/admin/AdminItemCard";
import {Button, Modal, Container, Form, Table} from "react-bootstrap";

export default function ItemPage(): React.JSX.Element {
    const [searchValue, setSearchValue] = React.useState("");
    const [items, setItems] = React.useState<Array<GetItemResponse>>([]);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [searchTags, setSearchTags] = React.useState<Array<number>>([]);
    const [editedItem, setEditedItem] = React.useState<GetItemResponse>({
        name: "",
        price: 0,
        available: true,
        description: "",
        imageUrl: "",
        id: 0,
        tags: []
    });
    const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);
    const [newItem, setNewItem] = React.useState<GetItemResponse>({
        name: "",
        price: 0,
        available: true,
        description: "",
        imageUrl: "",
        id: 0,
        tags: []
    });

    const createItem = async () => {
        setLoading(true);
        setShowCreateModal(false);
        const client = new ItemsApi(Config);
        const createdItem = await client.createItem({
            item: {
                name: newItem.name,
                price: newItem.price,
                available: newItem.available,
                description: newItem.description,
                imageUrl: newItem.imageUrl,
                tags: newItem.tags?.map(t => t.name || ""),
            }
        });
        setNewItem({
            name: "",
            price: 0,
            available: true,
            description: "",
            imageUrl: "",
            id: 0,
            tags: []
        });
        await searchItems();
        setLoading(false);
    }

    const searchItems = async () => {
        setLoading(true);
        const client = new ItemsApi(Config);
        const fetchedItems = await client.getItems({search: searchValue, tags: tags.filter(t => searchTags.includes(t.id || 0)).map(t => t.name).join(",")});
        setItems(fetchedItems);
        setLoading(false);
    }

    const editItem = async () => {
        setShowEditModal(false);
        const client = new ItemsApi(Config);
        await client.editItem({
            id: editedItem.id || 0,
            item: {
                name: editedItem.name,
                price: editedItem.price,
                available: editedItem.available,
                description: editedItem.description,
                imageUrl: editedItem.imageUrl,
                tags: editedItem.tags?.map(t => t.name || ""),
            }
        });
        setEditedItem({
            name: "",
            price: 0,
            available: true,
            description: "",
            imageUrl: "",
            id: 0,
            tags: []
        });
        await searchItems();
    }

    useEffect(() => {
        const fetchTags = async () => {
            const client = new TagsApi(Config);
            const fetchedTags = await client.getTags();
            setTags(fetchedTags);
            setSearchTags(t => fetchedTags.map(tag => tag.id || 0));
            await searchItems();
        }
        fetchTags();
    }, []);

    return (
        <div className="flex-fill tabs">
            <div>
                <Container>
                    <Button variant="success" className="w-100 mb-3" onClick={() => setShowCreateModal(true)}>
                        Create Item
                    </Button>
                </Container>
                <Container className="d-flex mb-3">
                    <Form.Control 
                        type="text" 
                        id="item-search" 
                        className="flex-fill me-3"
                        placeholder="Search Items"
                        aria-label="Item Search" 
                        value={searchValue} 
                        onChange={e => setSearchValue(e.target.value)}
                    />
                    <Button variant="outline-primary" onClick={searchItems}>Search</Button>
                </Container>
                <Container className="d-flex w-100 flex-wrap" id="tagButtons">
                    {
                        tags.map((tag, index) => (
                            <Button 
                                key={index}
                                variant="outline-secondary" 
                                className={`me-2 mb-2 ${searchTags.includes(tag.id || 0) ? 'active' : ''}`}
                                onClick={() => {
                                    setSearchTags(prev => prev.includes(tag.id || 0) ? prev.filter(t => t !== tag.id) : [...prev, tag.id || 0]);
                                }}
                            >
                                {tag.name}
                            </Button>
                        ))
                    }
                </Container>
                <Container className="d-flex flex-column">
                    <div className="table-responsive mt-3">
                        <Table striped hover className="mw-100" id="item-list">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center">Name</th>
                                <th scope="col" className="text-center">Image</th>
                                <th scope="col" className="text-center">Descriptions</th>
                                <th scope="col" className="text-center">Tags</th>
                                <th scope="col" className="text-center">Price</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">Loading...</td>
                                    </tr>
                                )
                                : items.length > 0 ? (
                                    items.map((item, index) => (
                                        <AdminItemCard key={index} item={item} onClick={() => {setEditedItem(item);setShowEditModal(true)}}/>))) : (
                                    <tr>
                                        <td colSpan={7} className="text-center">No items found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Container>
            </div>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            id="create-item-name" 
                            placeholder="Name"
                            value={newItem.name} 
                            onChange={e => setNewItem(p => ({...p, name: e.target.value}))}
                        />
                        <Form.Label htmlFor="create-item-name">Name</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="email" 
                            className="mt-2" 
                            id="create-item-image"
                            value={newItem.imageUrl}
                            onChange={e => setNewItem(p => ({...p, imageUrl: e.target.value}))} 
                            placeholder="Image"
                        />
                        <Form.Label htmlFor="create-item-image">Image URL</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            className="mt-2" 
                            id="create-item-description"
                            placeholder="Description" 
                            value={newItem.description}
                            onChange={e => setNewItem(p => ({...p, description: e.target.value}))}
                        />
                        <Form.Label htmlFor="create-item-description">Description</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="number" 
                            className="mt-2" 
                            id="create-item-price" 
                            value={newItem.price}
                            onChange={e => setNewItem(p => ({...p, price: parseInt(e.target.value) || 0}))}
                            placeholder="Price" 
                            min="0"
                        />
                        <Form.Label htmlFor="create-item-price">Price</Form.Label>
                    </Form.Floating>
                    <Form.Label htmlFor="create-item-available">Available: </Form.Label>
                    <Form.Check 
                        inline 
                        className="mt-3" 
                        id="create-item-available"
                        checked={newItem.available}
                        onChange={e => setNewItem(p => ({...p, available: e.target.checked}))}
                    />
                    <div className="mt-3" id="create-item-tags">
                        {tags.map((tag, index) => (
                            <Form.Check 
                                key={index} 
                                inline
                                type="checkbox" 
                                id={`create-item-tag-${tag.id}`}
                                checked={newItem.tags?.some(t => t.id === tag.id)}
                                onChange={() => {
                                    setNewItem(p => {
                                        const tags = p.tags || [];
                                        if (tags.some(t => t.id === tag.id)) {
                                            return {...p, tags: tags.filter(t => t.id !== tag.id)};
                                        } else {
                                            return {...p, tags: [...tags, tag]};
                                        }
                                    });
                                }}
                                label={tag.name}
                            />
                        ))}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createItem}
                            disabled={newItem.name?.trim() === "" || newItem.price === undefined || newItem.price <= 0 || newItem.description?.trim() === "" || newItem.imageUrl?.trim() === ""}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            id="edit-item-name" 
                            placeholder="Name"
                            value={editedItem.name} 
                            onChange={e => setEditedItem(p => ({...p, name: e.target.value}))}
                        />
                        <Form.Label htmlFor="edit-item-name">Name</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="email" 
                            className="mt-2" 
                            id="edit-item-image"
                            value={editedItem.imageUrl}
                            onChange={e => setEditedItem(p => ({...p, imageUrl: e.target.value}))} 
                            placeholder="Image"
                        />
                        <Form.Label htmlFor="edit-item-image">Image URL</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            className="mt-2" 
                            id="edit-item-description"
                            placeholder="Description" 
                            value={editedItem.description}
                            onChange={e => setEditedItem(p => ({...p, description: e.target.value}))}
                        />
                        <Form.Label htmlFor="edit-item-description">Description</Form.Label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control 
                            type="number" 
                            className="mt-2" 
                            id="edit-item-price" 
                            value={editedItem.price}
                            onChange={e => setEditedItem(p => ({...p, price: parseInt(e.target.value) || 0}))}
                            placeholder="Price" 
                            min="0"
                        />
                        <Form.Label htmlFor="edit-item-price">Price</Form.Label>
                    </Form.Floating>
                    <Form.Label htmlFor="edit-item-available">Available: </Form.Label>
                    <Form.Check 
                        inline 
                        className="mt-3" 
                        id="edit-item-available"
                        checked={editedItem.available}
                        onChange={e => setEditedItem(p => ({...p, available: e.target.checked}))}
                    />
                    <div className="mt-3" id="edit-item-tags">
                        {tags.map((tag, index) => (
                            <Form.Check 
                                key={index} 
                                inline
                                type="checkbox" 
                                id={`edit-item-tag-${tag.id}`}
                                checked={editedItem.tags?.some(t => t.id === tag.id)}
                                onChange={() => {
                                    setEditedItem(p => {
                                        const tags = p.tags || [];
                                        if (tags.some(t => t.id === tag.id)) {
                                            return {...p, tags: tags.filter(t => t.id !== tag.id)};
                                        } else {
                                            return {...p, tags: [...tags, tag]};
                                        }
                                    });
                                }}
                                label={tag.name}
                            />
                        ))}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editItem}
                            disabled={editedItem.name?.trim() === "" || editedItem.price === undefined || editedItem.price <= 0 || editedItem.description?.trim() === "" || editedItem.imageUrl?.trim() === ""}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}