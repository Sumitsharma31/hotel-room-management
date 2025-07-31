import React from "react";

export default function ErrorMessage({ message, onClose }) {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex justify-between items-center"
      role="alert"
    >
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
}
