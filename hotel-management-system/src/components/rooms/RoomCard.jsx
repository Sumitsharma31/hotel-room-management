import React from "react";

export default function RoomCard({
  room,
  onCheckIn,
  onCheckOut,
  onEdit,
  onDelete,
}) {
  const { isAvailable, roomNumber, type, price, guestName, checkInDate } = room;
  const cardColor = isAvailable ? "bg-white" : "bg-indigo-50";
  const statusColor = isAvailable
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
  const statusText = isAvailable ? "Available" : "Occupied";

  return (
    <div
      className={`${cardColor} rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col`}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">Room {roomNumber}</h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
        <p className="text-gray-600 mt-1">{type}</p>
        <p className="text-2xl font-light text-gray-900 mt-2">
          Rs-{price}
          <span className="text-sm font-normal text-gray-500">/night</span>
        </p>

        {!isAvailable && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              Guest:{" "}
              <span className="font-normal text-gray-600">{guestName}</span>
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1">
              Check-in:{" "}
              <span className="font-normal text-gray-600">{checkInDate}</span>
            </p>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 grid grid-cols-2 gap-2">
        {isAvailable ? (
          <button
            onClick={() => onCheckIn(room)}
            className="col-span-2 w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Check In
          </button>
        ) : (
          <button
            onClick={() => onCheckOut(room)}
            className="col-span-2 w-full bg-yellow-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition"
          >
            Check Out
          </button>
        )}
        <button
          onClick={() => onEdit(room)}
          className="bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 focus:outline-none transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(room.id)}
          className="bg-red-100 text-red-700 py-2 rounded-md text-sm font-semibold hover:bg-red-200 focus:outline-none transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
