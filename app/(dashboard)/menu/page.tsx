'use client';

import React, {useEffect} from "react";
import {GetItemResponse, Tag} from "@/lib/gen/models";
import ItemCard from "@/components/ui/ItemCard";
import Config from "@/lib/config";
import {ItemsApi, TagsApi} from "@/lib/gen/apis";
import {ResponseError} from "@/lib/gen/runtime";
import {useRouter} from "next/navigation";
1
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
            try {
                const fetchTagsPromise = tagsClient.getTags();
                const fetchItemsPromise = itemsClient.getItems();
                const [tags, items] = await Promise.all([fetchTagsPromise, fetchItemsPromise])
                setTags(tags);
                setMenuItems(items);
                setTagsLoading(false);
                setLoading(false);
            } catch (error) {
                if (error instanceof ResponseError) {
                    const responseCode = error.response.status;
                    if (responseCode === 401) {
                        alert("Unauthorized access. Please log in again.");
                        router.push("/login");
                    } else {
                        console.error("Error fetching data:", error);
                        alert("An error occurred while fetching data. Please try again later.");
                    }
                } else {
                    console.error("Unexpected error:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }
        })()
    }, [router])

    const handleSearch = async (event: React.FormEvent<HTMLFormElement> |  React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setLoading(true);
        const query = searchQuery.trim().toLowerCase();
        const itemsClient = new ItemsApi(Config);
        try {
            const items = await itemsClient.getItems({
                search: query,
                tags: selectedTags.map(t => tags[t].name).join(",")
            });
            setMenuItems(items);
            setLoading(false);
        } catch (error) {
            if (error instanceof ResponseError) {
                const responseCode = error.response.status;
                if (responseCode === 401) {
                    alert("Unauthorized access. Please log in again.");
                    router.push("/login");
                } else {
                    console.error("Error fetching items:", error);
                    alert("An error occurred while fetching items. Please try again later.");
                }
            }
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container d-flex mb-3 mt-3">
                <form onSubmit={handleSearch} className="w-100 d-flex align-items-center">
                    <div className="form-floating flex-fill w-100 d-flex">

                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                               id="item-search" className="flex-fill form-control me-3"
                               placeholder="Search Items"/>
                        <label htmlFor="item-search">Search Items</label>
                        <button className="btn btn-outline-primary">Search</button>
                    </div>
                </form>
            </div>
            <div className="container d-flex w-100 flex-wrap" id="tagButtons">
                {tagsLoading ? (
                    <div className="text-center h4">Loading tags...</div>
                ) : (
                    tags.map((tag, index) => (
                        <button key={index}
                                className={`btn btn-secondary me-2 mb-2 ${selectedTags.includes(index) ? 'active' : ''}`}
                                onClick={async (e) => {
                                    setSelectedTags(prev => prev.includes(index) ? prev.filter(t => t !== index) : [...prev, index]);
                                    await handleSearch(e)
                                }}>
                            {tag.name}
                        </button>
                    ))
                )}
            </div>
            <div id="menu"
                 className="container mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
                {loading ? (
                    <div
                        className="container mt-3 d-flex flex-fill flex-wrap align-content-center justify-content-center">
                        <div className="text-center h2">Loading...</div>
                    </div>
                ) : menuItems.length > 0 ? (
                    menuItems.map((item, index) => (
                        <ItemCard item={item} key={index}/>))
                ) : (
                    <div className="text-center h2">No items found.</div>
                )}
            </div>
        </>
    )
}