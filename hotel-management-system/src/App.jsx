import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";

// Import Firebase services and App ID from config file
import { db, auth, appId } from "./firebase/config.js";

// Import Components
import Header from "./components/Header.jsx";
import RoomGrid from "./components/rooms/RoomGrid.jsx";
import AddRoomModal from "./components/modals/AddRoomModal.jsx";
import EditRoomModal from "./components/modals/EditRoomModal.jsx";
import CheckInModal from "./components/modals/CheckInModal.jsx";
import ConfirmationModal from "./components/modals/ConfirmationModal.jsx";
import LoadingScreen from "./components/ui/LoadingScreen.jsx";
import ErrorMessage from "./components/ui/ErrorMessage.jsx";

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isCheckInModalOpen, setCheckInModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    action: () => {},
    message: "",
  });

  // --- Authentication Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          if (window.__initial_auth_token) {
            await signInWithCustomToken(auth, window.__initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.error("Authentication Error:", authError);
          setError("Failed to authenticate. Please refresh the page.");
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Data Fetching Effect ---
  useEffect(() => {
    if (!isAuthReady || !auth.currentUser) return;

    setLoading(true);
    const roomsCollectionPath = `artifacts/${appId}/users/${auth.currentUser.uid}/rooms`;
    const q = query(collection(db, roomsCollectionPath));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        roomsData.sort((a, b) => {
          const numA = parseInt(a.roomNumber.replace(/\D/g, "") || 0);
          const numB = parseInt(b.roomNumber.replace(/\D/g, "") || 0);
          return numA - numB;
        });
        setRooms(roomsData);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError("Failed to load room data. Check connection and permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, auth.currentUser]);

  // --- CRUD Handlers ---
  const handleAddRoom = async (roomData) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(
        collection(
          db,
          `artifacts/${appId}/users/${auth.currentUser.uid}/rooms`
        ),
        roomData
      );
      setAddModalOpen(false);
    } catch (e) {
      console.error("Error adding room: ", e);
      setError("Failed to add room.");
    }
  };

  const handleUpdateRoom = async (roomId, updatedData) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(
        doc(
          db,
          `artifacts/${appId}/users/${auth.currentUser.uid}/rooms`,
          roomId
        ),
        updatedData
      );
      setEditModalOpen(false);
      setCheckInModalOpen(false);
      setSelectedRoom(null);
    } catch (e) {
      console.error("Error updating room: ", e);
      setError("Failed to update room.");
    }
  };

  const executeDelete = async (roomId) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(
        doc(
          db,
          `artifacts/${appId}/users/${auth.currentUser.uid}/rooms`,
          roomId
        )
      );
    } catch (e) {
      console.error("Error deleting room: ", e);
      setError("Failed to delete room.");
    }
    setConfirmModalOpen(false);
  };

  const handleDeleteRoom = (roomId) => {
    setConfirmAction({
      action: () => executeDelete(roomId),
      message:
        "Are you sure you want to delete this room? This action cannot be undone.",
    });
    setConfirmModalOpen(true);
  };

  const handleCheckIn = (room) => {
    setSelectedRoom(room);
    setCheckInModalOpen(true);
  };

  const executeCheckOut = (room) => {
    handleUpdateRoom(room.id, {
      isAvailable: true,
      guestName: "",
      checkInDate: null,
      checkOutDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setConfirmModalOpen(false);
  };

  const handleCheckOut = (room) => {
    // The check-in date string is now in "DD-MM-YYYY" format.
    const parts = room.checkInDate.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    const checkInDate = new Date(year, month, day);

    const checkOutDate = new Date();
    // Set time to midnight to compare calendar days accurately
    checkOutDate.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);

    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();

    // Convert milliseconds to days
    let dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));

    // A same-day stay is considered 1 night.
    if (dayDifference <= 0) {
      dayDifference = 1;
    }

    const durationString = `${dayDifference} night${
      dayDifference !== 1 ? "s" : ""
    }`;
    const message = `Are you sure you want to check out the guest from Room ${room.roomNumber}?\n\nTotal Stay: ${durationString}`;

    setConfirmAction({
      action: () => executeCheckOut(room),
      message: message,
    });
    setConfirmModalOpen(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };

  if (!isAuthReady || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header
        onAddRoom={() => setAddModalOpen(true)}
        userId={auth.currentUser?.uid}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}
        <RoomGrid
          rooms={rooms}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
      </main>

      {isAddModalOpen && (
        <AddRoomModal
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddRoom}
          existingRooms={rooms}
        />
      )}
      {isCheckInModalOpen && selectedRoom && (
        <CheckInModal
          room={selectedRoom}
          onClose={() => {
            setCheckInModalOpen(false);
            setSelectedRoom(null);
          }}
          onSave={(data) => handleUpdateRoom(selectedRoom.id, data)}
        />
      )}
      {isEditModalOpen && selectedRoom && (
        <EditRoomModal
          room={selectedRoom}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedRoom(null);
          }}
          onSave={(data) => handleUpdateRoom(selectedRoom.id, data)}
          existingRooms={rooms}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={confirmAction.action}
          message={confirmAction.message}
        />
      )}
    </div>
  );
}
