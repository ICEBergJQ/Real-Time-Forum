# **Real Time Phorum Architecture Blueprint**

This document provides a concise summary of the project architecture, detailing how all components of the application work together. It serves as a guide for the development team and offers clarity on the project flow.

---

## **Blueprint: Full Stack Project Architecture**

### **1. Overview**
- **Front-End (User Interface):**  
  Built using HTML, CSS, and JavaScript, served directly from the back-end server. Handles user interactions such as login, registration, post viewing, commenting, liking, and filtering.

- **Back-End (Application Logic):**  
  Written in Go (Golang), serves the front-end static files, exposes RESTful APIs for front-end requests, handles business logic (authentication, CRUD operations), and communicates with the SQLite database. WebSockets are used **only** for the chat feature, while all other functionalities rely on HTTP APIs.

- **Database (Persistent Storage):**  
  SQLite database stores user data, posts, comments, categories, and likes/dislikes.

- **Containerization:**  
  The entire application (front-end, back-end, and database) runs within a single Docker container for simplicity.

---

## **System Diagram**

```plaintext
+-------------+          +-----------------------+          +-----------------+
|  Front-End  |          |       Back-End       |          |     Database    |
| (HTML/CSS/  |  --->    | (Golang APIs)        |  --->    |   (SQLite)      |
|  JavaScript)|          |                      |          |                 |
|             |          |                      |          |                 |
+-------------+          +-----------------------+          +-----------------+
      ^                            |                                  ^
      |                            |                                  |
      |                            v                                  |
      +----------------------- API Requests --------------------------+
      |                                                               |
      |                         WebSockets (Chat Only)                |
      +---------------------------------------------------------------+
```

---

## **Component Breakdown**

### **Front-End**
- **Technologies:** HTML, CSS, JavaScript
- **Responsibilities:**
  - Display the user interface.
  - Capture user input (forms, buttons, etc.).
  - Interact with the back-end via AJAX (RESTful API).
  - Establish a WebSocket connection for real-time chat.
- **Served From:** Back-end server

### **Back-End**
- **Technologies:** Go (Golang)
- **Responsibilities:**
  - Serve static front-end files.
  - Expose RESTful APIs for the front-end.
  - Handle business logic (e.g., authentication, CRUD operations).
  - Interact with the database (read/write operations).
  - Enforce security measures like hashing passwords.
  - **Manage WebSocket connections for real-time private chat.**
- **Port:** `8080`

### **Database**
- **Technology:** SQLite
- **Responsibilities:**
  - Store persistent data (users, posts, comments, categories, likes/dislikes).
  - Store chat messages (optional, if message history is needed).
  - Provide structured query results for the back-end.
  - Enforce relationships with constraints (foreign keys).

---

## **Real-Time Forum & Chat Integration**

### **WebSockets (Chat Feature)**
- **Backend (Go)**:
  - Create a WebSocket server to handle real-time messaging.
  - Store active connections in a map for private messaging.
  - Broadcast messages only to the intended recipient.

- **Frontend (JavaScript)**:
  - Establish a WebSocket connection to receive/send messages.
  - Update the UI dynamically when a message arrives.

### **HTTP (Forum Features - Posts, Comments, Likes)**
- **Forum operations (post creation, commenting, liking, etc.) remain HTTP-based.**
- The UI fetches new posts/comments using periodic API polling or manual refresh.

---

## **Project Workflow**

### **1. Initial Setup**
- Clone the repository.
- Set up environment variables in `.env`.
- Build and run the container using Docker.

### **2. Development Process**
- **Front-End Development:**
  - Work on HTML, CSS, and JavaScript for user interfaces.
  - Test API calls with mock data or the back-end.
  - Implement WebSocket client logic for chat.

- **Back-End Development:**
  - Develop RESTful APIs.
  - Implement WebSocket server logic.
  - Test APIs using tools like Postman or curl.
  - Integrate and test with the database.

- **Database Development:**
  - Design and optimize the schema.
  - Write and test queries.
  - Seed sample data for testing.

### **3. Testing and Debugging**
- Test individual components independently (e.g., API endpoints, WebSocket connections, UI responsiveness).
- Integrate the front-end and back-end.
- Verify database interactions.

### **4. Deployment**
- Run `docker run` to deploy the application locally or in a production environment.

---

## **Quick Summary Table**


| **Component**   | **Technology**           | **Responsibilities**                                   | **Port** |
|----------------|-------------------------|-------------------------------------------------------|----------|
| **Frontend**   | HTML, CSS, JavaScript    | User interface, AJAX requests, WebSockets (Chat)      | Served via backend |
| **Backend**    | Go (Golang)              | Business logic, API handling, database interaction, WebSocket chat | `8080`   |
| **Database**   | SQLite                   | Persistent storage for application data               | Internal |

---

