'use client';

import React, { useEffect } from 'react';
import { GetItemResponse, GetTagResponse } from '@/lib/gen/models';
import { ItemsApi, TagsApi } from '@/lib/gen/apis';
import Config from '@/lib/config';
import { AdminItemCard } from '@/components/ui/admin/AdminItemCard';
import { Button, Container, Form, Table } from 'react-bootstrap';
import ItemModal from '@/components/modals/ItemModal';
import { useItemModalStore } from '@/lib/stores/itemModalStore';

export default function ItemPage(): React.JSX.Element {
  const { openCreate, openEdit } = useItemModalStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [items, setItems] = React.useState<Array<GetItemResponse>>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTags, setSearchTags] = React.useState<Array<number>>([]);
  const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);

  const createItem = async () => {
    setLoading(true);
    const client = new ItemsApi(Config);
    const { item } = useItemModalStore.getState();
    const createdItem = await client.createItem({
      item: {
        name: item.name,
        price: item.price,
        available: item.available,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: item.tags?.map((t) => t.name || '')
      }
    });
    await searchItems();
    setLoading(false);
  };

  const searchItems = async () => {
    setLoading(true);
    const client = new ItemsApi(Config);
    const fetchedItems = await client.getItems({
      search: searchValue,
      tags: tags
        .filter((t) => searchTags.includes(t.id || 0))
        .map((t) => t.name)
        .join(',')
    });
    setItems(fetchedItems);
    setLoading(false);
  };

  const editItem = async () => {
    const client = new ItemsApi(Config);
    const { item } = useItemModalStore.getState();
    await client.editItem({
      id: item.id || 0,
      item: {
        name: item.name,
        price: item.price,
        available: item.available,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: item.tags?.map((t) => t.name || '')
      }
    });
    await searchItems();
  };

  useEffect(() => {
    const fetchTags = async () => {
      const client = new TagsApi(Config);
      const fetchedTags = await client.getTags();
      setTags(fetchedTags);
      setSearchTags((t) => fetchedTags.map((tag) => tag.id || 0));
      await searchItems();
    };
    fetchTags();
  }, []);

  return (
    <div className="flex-fill tabs">
      <div>
        <Container>
          <Button variant="success" className="w-100 mb-3" onClick={() => openCreate(tags, createItem)}>
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
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button variant="outline-primary" onClick={searchItems}>
            Search
          </Button>
        </Container>
        <Container className="d-flex w-100 flex-wrap" id="tagButtons">
          {tags.map((tag, index) => (
            <Button
              key={index}
              variant="outline-secondary"
              className={`me-2 mb-2 ${searchTags.includes(tag.id || 0) ? 'active' : ''}`}
              onClick={() => {
                setSearchTags((prev) =>
                  prev.includes(tag.id || 0) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id || 0]
                );
              }}
            >
              {tag.name}
            </Button>
          ))}
        </Container>
        <Container className="d-flex flex-column">
          <div className="table-responsive mt-3">
            <Table striped hover className="mw-100" id="item-list">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col" className="text-center">
                    Name
                  </th>
                  <th scope="col" className="text-center">
                    Image
                  </th>
                  <th scope="col" className="text-center">
                    Descriptions
                  </th>
                  <th scope="col" className="text-center">
                    Tags
                  </th>
                  <th scope="col" className="text-center">
                    Price
                  </th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((item, index) => (
                    <AdminItemCard
                      key={index}
                      item={item}
                      onClick={() => {
                        openEdit(item, tags, editItem);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>

      <ItemModal />
    </div>
  );
}
