'use client';

import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {useSearchModalStore} from '@/lib/stores/searchModalStore';
import SearchItemCard from '@/components/ui/SearchItemCard';
import CartItemCard from '@/components/ui/CartItemCard';
import {GetItemResponse} from '@/lib/gen/models';

export default function SearchModal(): React.JSX.Element {
    const {
        show,
        searchValue,
        tags,
        selectedTags,
        searchList,
        searchLoading,
        cart,
        onSearch,
        onConfirm,
        close,
        updateSearchValue,
        toggleTag,
        addToCart,
        removeFromCart
    } = useSearchModalStore();

    const handleSearch = () => {
        if (onSearch) {
            onSearch();
        }
    };

    const handleConfirm = () => {
        if (onConfirm && cart.length > 0) {
            onConfirm(cart);
        }
        close();
    };

    const handleAddToCart = (itemId: number, count: number, customInstructions: string) => {
        addToCart(itemId, count, customInstructions);
    };

    const handleRemoveFromCart = (itemId: number) => {
        removeFromCart(itemId);
    };

    // Get cart items with full item data
    const getCartItemsWithData = () => {
        return cart
            .map((cartItem) => {
                const item = searchList.find((searchItem) => searchItem.id === cartItem.itemId);
                return {
                    ...cartItem,
                    item: item as GetItemResponse
                };
            })
            .filter((cartItem) => cartItem.item); // Filter out items that might not be found
    };

    const cartItemsWithData = getCartItemsWithData();
    const totalPrice = cartItemsWithData.reduce((sum, cartItem) => {
        return sum + (cartItem.item.price || 0) * cartItem.count;
    }, 0);

    return (
        <Modal show={show} onHide={close} fullscreen>
            <Modal.Header closeButton>
                <Modal.Title>Search & Add Items</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex gap-2 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => updateSearchValue(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <div className="mb-3 d-flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Button
                            key={index}
                            variant={selectedTags.includes(index) ? 'primary' : 'secondary'}
                            onClick={() => {
                                toggleTag(index);
                                handleSearch();
                            }
                            }
                        >
                            {tag.name}
                        </Button>
                    ))}
                </div>
                <hr/>

                <div className="row">
                    {/* Left Section - Search Results */}
                    <div className="col-md-8">
                        <h5 className="mb-3">Search Results</h5>
                        {searchLoading ? (
                            <div className="text-center h4">Loading...</div>
                        ) : searchList.length === 0 ? (
                            <div className="text-center h4">No items found.</div>
                        ) : (
                            <div className="d-flex flex-wrap justify-content-start">
                                {searchList.map((item, index) => {
                                    const cartItem = cart.find((c) => c.itemId === item.id);
                                    return (
                                        <SearchItemCard key={index} item={item} onAddToCart={handleAddToCart}
                                                        currentCartItem={cartItem}/>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Section - Cart */}
                    <div className="col-md-4">
                        <div className="border-start h-100 ps-3">
                            <h5 className="mb-3">Cart ({cartItemsWithData.length} items)</h5>
                            {cartItemsWithData.length === 0 ? (
                                <div className="text-center text-muted">
                                    <p>No items in cart</p>
                                    <p className="small">Use the +/- buttons to add items</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        {cartItemsWithData.map((cartItem, index) => (
                                            <CartItemCard
                                                key={index}
                                                item={cartItem.item}
                                                count={cartItem.count}
                                                customInstructions={cartItem.customInstructions}
                                                onRemove={handleRemoveFromCart}
                                            />
                                        ))}
                                    </div>
                                    <div className="border-top pt-3">
                                        <h6 className="text-end">
                                            Total: <code>${totalPrice.toFixed(2)}</code>
                                        </h6>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="success" onClick={handleConfirm} disabled={cart.length === 0}>
                    Confirm ({cart.length} items) - ${totalPrice.toFixed(2)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
