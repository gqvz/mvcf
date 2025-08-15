'use client';

import React from 'react';
import { GetTagResponse } from '@/lib/gen/models';
import { Button, Container, Table } from 'react-bootstrap';
import Config from '@/lib/config';
import { TagsApi } from '@/lib/gen/apis';
import AdminTagCard from '@/components/ui/admin/AdminTagCard';
import TagModal from '@/components/modals/TagModal';
import { useTagModalStore } from '@/lib/stores/tagModalStore';

export default function TagsPage(): React.JSX.Element {
  const { openCreate, openEdit } = useTagModalStore();
  const [tags, setTags] = React.useState<Array<GetTagResponse>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [tagName, setTagName] = React.useState<string>('');
  const [editTagId, setEditTagId] = React.useState<number>(0);

  const createTag = async () => {
    const tagsApi = new TagsApi(Config);
    const { tagName } = useTagModalStore.getState();
    await tagsApi.createTag({ tag: { name: tagName } });
    setTagName('');
  };

  const fetchTags = async () => {
    setLoading(true);
    const tagsApi = new TagsApi(Config);
    const fetchedTags = await tagsApi.getTags();
    setTags(fetchedTags);
    setLoading(false);
  };

  const editTag = async (id: number) => {
    const tagsApi = new TagsApi(Config);
    const { tagName } = useTagModalStore.getState();
    await tagsApi.editTag({ id: id, tag: { name: tagName } });
    setTagName('');
    setEditTagId(0);
    fetchTags();
  };

  React.useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="flex-fill tabs">
      <Container className="d-flex flex-column">
        <Button variant="success" onClick={() => openCreate(createTag)}>
          Create Tag
        </Button>
        <div className="table-responsive mt-3">
          <Table striped hover className="mw-100" id="tag-list">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col" className="text-center">
                  Name
                </th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : tags.length > 0 ? (
                tags.map((tag, index) => (
                  <AdminTagCard
                    key={index}
                    onClick={() => {
                      setTagName(tag.name || '');
                      setEditTagId(tag.id || 0);
                      openEdit(tag.name || '', async () => await editTag(tag?.id || 0));
                    }}
                    tag={tag}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
      <TagModal />
    </div>
  );
}
