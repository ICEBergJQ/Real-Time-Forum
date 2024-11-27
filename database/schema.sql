-- Users Table :
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL, 
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table :
CREATE TABLE IF NOT EXISTS posts (
    post_id TEXT PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    category_id TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- categories Table : 
CREATE TABLE IF NOT EXISTS categories (
    category_id TEXT,
    name TEXT NOT NULL UNIQUE,
);

-- comments Table :
CREATE TABLE IF NOT EXISTS comments (
    comment_id TEXT PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    post_id TEXT,
    content TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- like/dislike Table :
CREATE TABLE IF NOT EXISTS likeAndDislike (
    likeAndDislike_id TEXT PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    post_id TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN Key (post_id) REFERENCES Posts(post_id),
    UNIQUE (user_id, post_id)
);