import React, { useState } from "react";
import Modal from "./Modal";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";

export default function EditRoomModal({
  room,
  onClose,
  onSave,
  existingRooms,
}) {
  const [formData, setFormData] = useState({ ...room });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.roomNumber || !formData.price) {
      setError("Room Number and Price are required.");
      return;
    }

    const isDuplicate = existingRooms.some(
      (r) => r.roomNumber === formData.roomNumber.trim() && r.id !== room.id
    );
    if (isDuplicate) {
      setError(`Room number "${formData.roomNumber.trim()}" already exists.`);
      return;
    }

    onSave({
      ...formData,
      roomNumber: formData.roomNumber.trim(),
      price: parseFloat(formData.price),
    });
  };

  return (
    <Modal onClose={onClose} title={`Edit Room ${room.roomNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {error && <p className="text-red-500 text-sm -mt-2 mb-2">{error}</p>}
        <FormInput
          label="Room Number"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          required
        />
        <FormSelect
          label="Room Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={["Standard", "Deluxe", "Suite", "Penthouse"]}
        />
        <FormInput
          label="Price per Night"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
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
            className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
