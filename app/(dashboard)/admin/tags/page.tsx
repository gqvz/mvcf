'use client';

import React from "react";
import {GetTagResponse} from "@/lib/gen/models";
import {Button, Modal, Container, Form, Table} from "react-bootstrap";
import Config from "@/lib/config";
import {TagsApi} from "@/lib/gen/apis";
import AdminTagCard from "@/components/ui/admin/AdminTagCard";

export default function TagsPage(): React.JSX.Element {
    const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [showCreateTagModal, setShowCreateTagModal] = React.useState<boolean>(false);
    const [showEditTagModal, setShowEditTagModal] = React.useState<boolean>(false);
    const [tagName, setTagName] = React.useState<string>("");
    const [editTagId, setEditTagId] = React.useState<number>(0);

    const createTag = async () => {
        const tagsApi = new TagsApi(Config);
        await tagsApi.createTag({tag: {name: tagName}});
        setTagName("");
        setShowCreateTagModal(false);
    }

    const fetchTags = async () => {
        setLoading(true);
        const tagsApi = new TagsApi(Config);
        const fetchedTags = await tagsApi.getTags();
        setTags(fetchedTags);
        setLoading(false);
    }

    const editTag = async () => {
        const tagsApi = new TagsApi(Config);
        await tagsApi.editTag({id: editTagId, tag: {name: tagName}});
        setTagName("");
        setEditTagId(0);
        setShowEditTagModal(false);
        fetchTags();
    }

    React.useEffect(() => {
        fetchTags();
    }, []);

    return (
        <div className="flex-fill tabs">
            <Container className="d-flex flex-column">
                <Button variant="success" onClick={() => setShowCreateTagModal(true)}>
                    Create Tag
                </Button>
                <div className="table-responsive mt-3">
                    <Table striped hover className="mw-100" id="tag-list">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col" className="text-center">Name</th>
                            <th scope="col" className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">Loading...</td>
                            </tr>
                        ) : tags.length > 0 ? (
                            tags.map((tag, index) => (<AdminTagCard key={index} onClick={() => {
                                setTagName(tag.name || "");
                                setEditTagId(tag.id || 0);
                                setShowEditTagModal(true);
                            }} tag={tag}/>))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">No tags found.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
            </Container>
            <Modal show={showCreateTagModal} onHide={() => setShowCreateTagModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            value={tagName}
                            onChange={e => setTagName(e.target.value)} 
                            id="tag-name" 
                            placeholder="Tag Name"
                        />
                        <Form.Label htmlFor="tag-name">Tag Name</Form.Label>
                    </Form.Floating>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateTagModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createTag} disabled={tagName.trim() === ""}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditTagModal} onHide={() => setShowEditTagModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Floating>
                        <Form.Control 
                            type="text" 
                            value={tagName}
                            onChange={e => setTagName(e.target.value)} 
                            id="tag-name" 
                            placeholder="Tag Name"
                        />
                        <Form.Label htmlFor="tag-name">Tag Name</Form.Label>
                    </Form.Floating>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditTagModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editTag} disabled={tagName.trim() === ""}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}