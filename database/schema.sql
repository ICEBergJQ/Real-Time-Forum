PRAGMA foreign_keys = ON;

-- Users Table:
CREATE TABLE
    IF NOT EXISTS users (
        user_id TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id)
    );

-- Posts Table:
CREATE TABLE
    IF NOT EXISTS posts (
        post_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
    );

-- Categories Table:
CREATE TABLE
    IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

-- PostsCategories Table:
CREATE TABLE
    IF NOT EXISTS postsCategories (
        post_id TEXT,
        category_id INTEGER,
        PRIMARY KEY (post_id, category_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
    );

-- Comments Table:
CREATE TABLE
    IF NOT EXISTS comments (
        comment_id TEXT PRIMARY KEY,
        user_id TEXT,
        post_id TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE
    );

-- Like/Dislike Table:
CREATE TABLE
    IF NOT EXISTS likeAndDislike (
        likeAndDislike_id TEXT PRIMARY KEY,
        user_id TEXT,
        post_id TEXT,
        comment_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
        UNIQUE (user_id, post_id, comment_id)
    );

-- Insert Default Categories:
INSERT OR IGNORE INTO categories (name) VALUES
    ('Technology'),
    ('Sport'),
    ('Health'),
    ('Lifestyle'),
    ('Education');
