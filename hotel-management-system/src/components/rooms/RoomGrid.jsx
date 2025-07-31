import React from "react";
import RoomCard from "./RoomCard";

export default function RoomGrid({
  rooms,
  onCheckIn,
  onCheckOut,
  onEdit,
  onDelete,
}) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No rooms found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new room.
        </p>
      </div>
    );
  }

  const groupedRooms = rooms.reduce((acc, room) => {
    const type = room.type || "Uncategorized";
    if (!acc[type]) acc[type] = [];
    acc[type].push(room);
    return acc;
  }, {});

  const roomTypeOrder = [
    "Standard",
    "Deluxe",
    "Suite",
    "Penthouse",
    "Uncategorized",
  ];
  const sortedRoomTypes = Object.keys(groupedRooms).sort((a, b) => {
    const indexA = roomTypeOrder.indexOf(a);
    const indexB = roomTypeOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="space-y-10">
      {sortedRoomTypes.map((type) => (
        <section key={type}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
            {type} Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {groupedRooms[type].map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onCheckIn={onCheckIn}
                onCheckOut={onCheckOut}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
