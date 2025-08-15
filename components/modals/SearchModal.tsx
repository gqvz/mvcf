'use client';

import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSearchModalStore } from '@/lib/stores/searchModalStore';
import ItemCard from '@/components/ui/ItemCard';

export default function SearchModal(): React.JSX.Element {
  const {
    show,
    searchValue,
    tags,
    selectedTags,
    searchList,
    searchLoading,
    onSearch,
    onItemSelect,
    close,
    updateSearchValue,
    toggleTag
  } = useSearchModalStore();
  const handleItemSelect = (item: any) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
    close();
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <Modal show={show} onHide={close} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          className="mb-3"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => updateSearchValue(e.target.value)}
        />
        <div className="mb-3 d-flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Button
              key={index}
              variant={selectedTags.includes(index) ? 'primary' : 'secondary'}
              onClick={() => toggleTag(index)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
        <hr />
        <div className="d-flex justify-content-center align-items-center mb-3">
          {searchLoading ? (
            <div className="text-center h4">Loading...</div>
          ) : searchList.length === 0 ? (
            <div className="text-center h4">No items found.</div>
          ) : (
            searchList.map((item, index) => <ItemCard key={index} item={item} onClick={handleItemSelect} />)
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
