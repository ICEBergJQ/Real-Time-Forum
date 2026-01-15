# Real-Time Forum

A full-stack real-time forum application featuring post creation, comments, categories, likes/dislikes, and a real-time private chat system.

## 🚀 Features

*   **User Authentication**: Secure Signup, Login, and Logout.
*   **Forum Interactions**: Create posts, comment on posts, and like/dislike content.
*   **Categories**: Organize and filter posts by categories.
*   **Real-Time Chat**: Private messaging between online users using WebSockets.
*   **Responsive UI**: Frontend built with Vanilla JavaScript and CSS.
*   **Containerized**: Easy deployment with Docker.

## 🛠️ Tech Stack

*   **Backend**: Go (Golang)
*   **Database**: SQLite
*   **Frontend**: HTML, CSS, Vanilla JavaScript
*   **Containerization**: Docker

## 📋 Prerequisites

*   **Docker** (Recommended for easiest setup)
*   **Go 1.22+** (If running locally)
*   **GCC** (Required for SQLite CGO if running locally)

## 🏃‍♂️ How to Run

### Method 1: Using Docker (Recommended)

This method ensures all dependencies and paths are correctly configured.

1.  **Run the helper script:**
    ```bash
    ./docker/RunDocker.sh
    ```
    This script will stop any existing container, build the image, and run the new container.

2.  **Access the application:**
    Open your browser and go to [http://localhost:8080](http://localhost:8080).

### Method 2: Running Locally

If you prefer to run it without Docker, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    go mod download
    ```

3.  **Run the application:**
    ```bash
    go run main.go
    ```
    *Note: The application expects the `frontend` and `database` directories to be in the parent directory (`../`), so you must run this command from inside the `backend` folder.*

4.  **Access the application:**
    Open [http://localhost:8080](http://localhost:8080).

---

## 🏗️ Architecture Blueprint

### Overview
*   **Front-End**: Served by the Go backend. Handles UI and WebSocket connections.
*   **Back-End**: Go REST API + WebSocket server.
*   **Database**: SQLite for persistent storage.

### System Diagram
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

### Directory Structure
```
├── backend/        # Go application source code
├── database/       # SQL schema and DB file
├── docker/         # Docker configuration
└── frontend/       # Static assets (HTML, JS, CSS)
```

### Port
The server listens on port **8080**.