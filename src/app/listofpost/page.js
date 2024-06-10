"use client";

import React, { useEffect, useState } from "react";
import { getAllItems, likeItem } from "@/actions";
import { useUser } from "@clerk/nextjs";
import Modal from "@/app/components/Modal";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

function ListofPost() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [modalData, setModalData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function fetchItems() {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    }

    fetchItems();
  }, []);

  const handleLike = async (itemId) => {
    const result = await likeItem(itemId, user.id);
    if (result.success) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, likedBy: result.data.likedBy } : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, likedBy: result.data.likedBy } : item
        )
      );
    } else {
      alert("Failed to like item");
    }
  };

  const handleShowLikedBy = (likedBy) => {
    setModalData(likedBy);
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredItems(
        items.filter((item) =>
          item.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
    setVisibleCount(4); // Reset visible count when searching
  };

  const formatTimeAgo = (date) => {
    const distance = formatDistanceToNowStrict(new Date(date));
    return `${distance.replace("about ", "").replace(" ago", "")} ago`;
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const handleShowLess = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 4, 4));
  };

  return (
    <div className="m-auto w-[50%] p-[20px]">
      <h1 className="text-center text-2xl ">List of Posts</h1>
      <Link
        href="/"
        className="text-center m-auto flex justify-center mb-[20px]  text-[#ffd000]"
      >
        Home
      </Link>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded text-[black]"
      />
      <div className="flex flex-col m-auto gap-[18px]">
        {filteredItems
          .slice()
          .reverse()
          .slice(0, visibleCount)
          .map((item) => (
            <div
              key={item._id}
              className="p-[10px] border-[1px] bg-[#272730] border-[#4b4d5f] rounded-[25px]"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-[100%] rounded-[15px]"
              />
              <div>
                <div className="py-[5px] flex justify-between items-center">
                  <span className="font-bold">{item.name}</span>
                  <p className="text-[#d6d3d3]">
                    {" "}
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
                <p>{item.email}</p>
                <p>Likes: {item.likedBy ? item.likedBy.length : 0}</p>
                <button
                  onClick={() => handleLike(item._id)}
                  className="text-[#ffdf2d]"
                >
                  {item.likedBy && item.likedBy.includes(user.id)
                    ? "Unlike"
                    : "Like"}
                </button>
                <button
                  onClick={() => handleShowLikedBy(item.likedBy)}
                  className="ml-[10px] text-[#90e947] font-bold"
                >
                  Show Likes
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-between mt-4">
        {visibleCount > 4 && (
          <button
            onClick={handleShowLess}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Show Less
          </button>
        )}
        {visibleCount < filteredItems.length && (
          <button
            onClick={handleShowMore}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Show More
          </button>
        )}
      </div>
      <Modal show={!!modalData} onClose={handleCloseModal} title="Liked by">
        <ul>
          {modalData && modalData.length > 0 ? (
            modalData.map((userId) => <li key={userId}>{userId}</li>) // Replace userId with actual user info if available
          ) : (
            <li>No likes yet</li>
          )}
        </ul>
      </Modal>
    </div>
  );
}

export default ListofPost;
