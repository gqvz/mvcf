'use client';

import React, { useEffect } from 'react';
import { GetItemResponse, Tag } from '@/lib/gen/models';
import ItemCard from '@/components/ui/ItemCard';
import Config from '@/lib/config';
import { ItemsApi, TagsApi } from '@/lib/gen/apis';
import { useRouter } from 'next/navigation';
import { Button, Container, Form } from 'react-bootstrap';

export default function MenuPage(): React.JSX.Element {
  const router = useRouter();

  const [menuItems, setMenuItems] = React.useState<Array<GetItemResponse>>([]);
  const [tags, setTags] = React.useState<Array<Tag>>([]);
  const [selectedTags, setSelectedTags] = React.useState<Array<number>>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [tagsLoading, setTagsLoading] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const tagsClient = new TagsApi(Config);
      const itemsClient = new ItemsApi(Config);
      const fetchTagsPromise = tagsClient.getTags();
      const fetchItemsPromise = itemsClient.getItems();
      const [tags, items] = await Promise.all([fetchTagsPromise, fetchItemsPromise]);
      setTags(tags);
      setMenuItems(items);
      setTagsLoading(false);
      setLoading(false);
    })();
  }, [router]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    const query = searchQuery.trim().toLowerCase();
    const itemsClient = new ItemsApi(Config);
    const items = await itemsClient.getItems({
      search: query,
      tags: selectedTags.map((id) => tags.find((tag) => tag.id === id)?.name).join(',')
    });
    setMenuItems(items);
    setLoading(false);
  };

  return (
    <>
      <Container className="d-flex mb-3 mt-3">
        <Form onSubmit={handleSearch} className="w-100 d-flex align-items-center">
          <Form.Floating className="flex-fill w-100 d-flex">
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="item-search"
              className="flex-fill me-3"
              placeholder="Search Items"
            />
            <Form.Label htmlFor="item-search">Search Items</Form.Label>
            <Button variant="outline-primary" type="submit">
              Search
            </Button>
          </Form.Floating>
        </Form>
      </Container>
      <Container className="d-flex w-100 flex-wrap" id="tagButtons">
        {tagsLoading ? (
          <div className="text-center h4">Loading tags...</div>
        ) : (
          tags.map((tag, index) => (
            <Button
              key={index}
              variant="secondary"
              className={`me-2 mb-2 ${selectedTags.includes(tag?.id || 0) ? 'active' : ''}`}
              onClick={async (e) => {
                setSelectedTags((prev) =>
                  prev.includes(tag?.id || 0) ? prev.filter((t) => t !== tag?.id || 0) : [...prev, tag?.id || 0]
                );
              }}
            >
              {tag.name}
            </Button>
          ))
        )}
      </Container>
      <Container id="menu" className="mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
        {loading ? (
          <Container className="mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
            <div className="text-center h2">Loading...</div>
          </Container>
        ) : menuItems.length > 0 ? (
          menuItems.map((item, index) => <ItemCard item={item} key={index} onClick={undefined} />)
        ) : (
          <div className="text-center h2">No items found.</div>
        )}
      </Container>
    </>
  );
}
