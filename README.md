
## 1. Introduction

The Hotel Room Management System is a modern, real-time web application designed to help hotel staff manage room status, guest check-ins, and check-outs efficiently. Built with React and Firebase, the application provides a responsive and intuitive user interface that works seamlessly across desktops, tablets, and mobile devices.

The core of the application is its real-time capability, powered by Firebase Firestore. Any change made by a user—such as checking a guest in or updating a room's price—is instantly reflected for all other users without needing a page refresh.

### Technologies Used
* **Frontend:** React.js (v19)
* **Backend & Database:** Firebase (Firestore, Authentication)
* **Styling:** Tailwind CSS
* **Build Tool:** Vite (or Create React App)
* **Language:** JavaScript (ES6+) with JSX

---

## 2. Key Features

* **Real-time Room Dashboard:** View all hotel rooms, grouped by type (e.g., Standard, Deluxe, Suite) for a clear and organized overview.
* **Dynamic Room Status:** Room cards use distinct color codes and labels to clearly indicate whether a room is "Available" or "Occupied."
* **Guest Check-In/Check-Out:** A simple, modal-based workflow allows staff to check guests in and out quickly. The system automatically updates the room's status and guest information.
* **Stay Duration Calculation:** Upon check-out, the system automatically calculates and displays the total number of nights the guest has stayed, providing valuable data for billing and records.
* **Room Management (CRUD):**
    * **Create:** Add new rooms with details like room number, type, and price per night.
    * **Read:** View all room details on the main dashboard.
    * **Update:** Edit existing room information at any time.
    * **Delete:** Remove rooms from the system with a confirmation step.
* **Unique Room Number Validation:** The system prevents the creation of rooms with duplicate numbers to ensure data integrity.
* **Secure, User-Specific Dta:** Each user's data is stored securely and separately using Firebase Authentication and Firestore Security Rules, ensuring privacy and data isolation.
* **Standardized Date Format:** All dates are stored and displayed in a consistent `DD-MM-YYYY` format.

---

## 3. Project Structure

The project follows a standard, component-based architecture which makes it scalable and easy to maintain.

```
/src
|
|-- /components
|   |-- /modals
|   |   |-- AddRoomModal.jsx
|   |   |-- CheckInModal.jsx
|   |   |-- ConfirmationModal.jsx
|   |   |-- EditRoomModal.jsx
|   |   -- Modal.jsx |   |-- /rooms |   |   |-- RoomCard.jsx |   |   -- RoomGrid.jsx
|   |-- /ui
|   |   |-- ErrorMessage.jsx
|   |   |-- FormInput.jsx
|   |   |-- FormSelect.jsx
|   |   |-- FormTextarea.jsx
|   |   -- LoadingScreen.jsx |   -- Header.jsx
|
|-- /firebase
|   -- config.js         // Firebase initialization and configuration | |-- App.jsx               // Main application component with state and logic | -- main.jsx              // Entry point for Vite projects (or index.js)
```


---

## 4. Setup and Installation

Follow these steps to set up and run the project on your local machine.

### Prerequisites
* Node.js (v19 or later)
* npm (or yarn/pnpm)
* A Google account to create a Firebase project.

### Step 1: Firebase Setup

1.  **Create a Firebase Project:**
    * Go to the [Firebase Console](https://console.firebase.google.com/).
    * Click "Add project" and follow the on-screen instructions.

2.  **Create a Web App:**
    * In your project's dashboard, click the web icon (`</>`) to create a new web app.
    * Register your app. Firebase will provide you with a `firebaseConfig` object. **Copy this object.**

3.  **Enable Firestore Database:**
    * From the left menu, go to **Build > Firestore Database**.
    * Click "Create database".
    * Choose **Start in production mode**.
    * Select a location for your database and click "Enable".

4.  **Set Firestore Security Rules:**
    * In the Firestore section, go to the **Rules** tab.
    * Replace the default rule with the following to ensure users can only access their own data:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /artifacts/{appId}/users/{userId}/{documents=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```
    * Click **Publish**.

5.  **Enable Anonymous Authentication:**
    * From the left menu, go to **Build > Authentication**.
    * Go to the **Sign-in method** tab.
    * Select "Anonymous" from the list, enable it, and save.

### Step 2: Local Project Setup

1.  **Get the Project Code:**
    * Download or clone the project files to your local machine.

2.  **Navigate to the Project Directory:**
    ```bash
    cd path/to/your-project
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Firebase Credentials:**
    * Open the file `/src/firebase/config.js`.
    * Replace the placeholder `firebaseConfig` object with the one you copied from the Firebase console.

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running locally, typically at `http://localhost:5173`.

---

## 6. Future Improvements

* **User Accounts:** Implement email/password or social logins to replace anonymous authentication for named user management.
* **Booking System:** Add a calendar view to manage future bookings and reservations.
* **Search and Filter:** Allow users to search for specific rooms or filter by price, availability, or other criteria.
* **Dashboard Analytics:** Create a dashboard page with charts showing occupancy rates, revenue, and other key metrics.
* **User Roles:** Introduce different user roles (e.g., Admin, Manager, Staff) with varying levels of permissions.
