PRAGMA foreign_keys = ON;

CREATE TABLE
    IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    );

CREATE TABLE
    IF NOT EXISTS posts (
        post_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        category_name TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
    );

CREATE TABLE
    IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS postsCategories (
        post_id TEXT,
        category_id INTEGER,
        PRIMARY KEY (post_id, category_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
    );

CREATE TABLE
    IF NOT EXISTS comments (
        comment_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS likeAndDislike (
        likeAndDislike_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        post_id TEXT,
        comment_id TEXT,
        reaction_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
        UNIQUE (user_id, post_id, comment_id)
    );

CREATE TABLE IF NOT EXISTS session (
    user_id INTEGER NOT NULL,
    session_id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT OR IGNORE INTO categories (category_name) VALUES
    ('Technology'),
    ('Sport'),
    ('Health'),
    ('Lifestyle'),
    ('Education');
