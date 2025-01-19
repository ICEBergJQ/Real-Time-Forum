# **Phorum Architecture Blueprint**

This document provides a concise summary of the project architecture, detailing how all components of the application work together. It serves as a guide for the development team and offers clarity on the project flow.

---

## **Blueprint: Full Stack Project Architecture**

### **1. Overview**
- **Front-End (User Interface):**  
  Built using HTML, CSS, and JavaScript, served directly from the back-end server. Handles user interactions such as login, registration, post viewing, commenting, liking, and filtering.

- **Back-End (Application Logic):**  
  Written in Go (Golang), serves the front-end static files, exposes RESTful APIs for front-end requests, handles business logic (authentication, CRUD operations), and communicates with the SQLite database.

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
```

---

## **Component Breakdown**

### **Front-End**
- **Technologies:** HTML, CSS, JavaScript
- **Responsibilities:**
  - Display the user interface.
  - Capture user input (forms, buttons, etc.).
  - Interact with the back-end via AJAX (RESTful API).
- **Served From:** Back-end server

### **Back-End**
- **Technologies:** Go (Golang)
- **Responsibilities:**
  - Serve static front-end files.
  - Expose RESTful APIs for the front-end.
  - Handle business logic (e.g., authentication, CRUD operations).
  - Interact with the database (read/write operations).
  - Enforce security measures like hashing passwords.
- **Port:** `8080`

### **Database**
- **Technology:** SQLite
- **Responsibilities:**
  - Store persistent data (users, posts, comments, categories, likes/dislikes).
  - Provide structured query results for the back-end.
  - Enforce relationships with constraints (foreign keys).

---

## **Key Components**

- **Back-End Service:**
  - Runs a Go application that serves both static files and APIs.
  - Manages all front-end requests and database interactions.

- **Database Service:**
  - SQLite database initialized with schema and seed data.
  - Persistent data stored within the container.

---

## **Data Flow**

1. **User Interaction (Frontend):**
   - User submits a request (e.g., registration, liking a post).
   - Front-end sends an AJAX request to the back-end API.

2. **API Processing (Backend):**
   - Receives the request, processes it, and interacts with the database.
   - Returns a response (success, error, or data) to the front-end.

3. **Database Queries:**
   - Backend executes SQL queries (e.g., `SELECT`, `INSERT`) to interact with the SQLite database.
   - Results are sent back to the back-end for further processing or direct response to the user.

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

- **Back-End Development:**
  - Develop RESTful APIs.
  - Test APIs using tools like Postman or curl.
  - Integrate and test with the database.

- **Database Development:**
  - Design and optimize the schema.
  - Write and test queries.
  - Seed sample data for testing.

### **3. Testing and Debugging**
- Test individual components independently (e.g., API endpoints, UI responsiveness).
- Integrate the front-end and back-end.
- Verify database interactions.

### **4. Deployment**
- Run `docker run` to deploy the application locally or in a production environment.

---

## **Quick Summary Table**

| **Component**   | **Technology**           | **Responsibilities**                                   | **Port** |
|------------------|--------------------------|-------------------------------------------------------|----------|
| **Frontend**     | HTML, CSS, JavaScript    | User interface, AJAX requests                         | Served via backend |
| **Backend**      | Go (Golang)             | Business logic, API handling, database interaction    | `8080`   |
| **Database**     | SQLite                  | Persistent storage for application data               | Internal |

---

