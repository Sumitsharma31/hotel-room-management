import React, { useState } from "react";
import Modal from "./Modal";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";

export default function CheckInModal({ room, onClose, onSave }) {
  // The input's value must be YYYY-MM-DD, so we keep the state in that format.
  const [formData, setFormData] = useState({
    guestName: "",
    checkInDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName) {
      setError("Guest Name is required for check-in.");
      return;
    }

    // Convert date from YYYY-MM-DD to DD-MM-YYYY before saving
    const parts = formData.checkInDate.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    onSave({
      isAvailable: false,
      guestName: formData.guestName,
      checkInDate: formattedDate, // Save in the new DD-MM-YYYY format
      notes: formData.notes,
    });
  };

  return (
    <Modal onClose={onClose} title={`Check In to Room ${room.roomNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {error && <p className="text-red-500 text-sm -mt-2 mb-2">{error}</p>}
        <FormInput
          label="Guest Name"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          required
          autoFocus
        />
        <FormInput
          label="Check-in Date"
          name="checkInDate"
          type="date"
          value={formData.checkInDate}
          onChange={handleChange}
          required
        />
        <FormTextarea
          label="Notes (optional)"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Confirm Check-in
          </button>
        </div>
      </form>
    </Modal>
  );
}
