-- add sample users
INSERT INTO users (user_id, username, email, password) VALUES
(1, 'abdeladim', 'abdeladim@hotmail.com', 'Talent01'),
(2, 'lazy', 'lazy@gmail.com', 'Lazyzone01'),
(3, 'lmodir', 'lmodir@outlook.com', 'Manager789'),
(4, 'mohcine', 'mohcineDEV@gmail.com', 'MohcineDEVErrachidia97'),
(5, 'ali', 'aliEss@gmail.com', 'ESS1234ali'),
(6, 'mohammed', 'mohammedGH@yahoo.com', 'Agadir2002');

-- --- I ADD THIS IN SCHEMA.SQL FOR TESTING ----
-- add sample categories
-- INSERT INTO categories (name) VALUES
-- ('Technology'),
-- ('Sport'),
-- ('Health'),
-- ('Lifestyle'),
-- ('Education');
-- --------------------------------------------

-- add sample posts
INSERT INTO posts (post_id, user_id, category_id, title, content) VALUES
('post1', 'user1', 1, 'The Future of AI', 'AI is transforming the world in many ways...'),
('post2', 'user2', 2, 'Staying Healthy During Winter', 'Tips to stay healthy and avoid the flu...'),
('post3', 'user3', 3, '10 Ways to Improve Your Life', 'Small habits can change your life dramatically...');

-- Link posts with categories in postsCategories table
INSERT INTO postsCategories (post_id, category_id) VALUES
('post1', 1),
('post2', 2),
('post3', 3);

-- add sample comments
INSERT INTO comments (comment_id, user_id, post_id, content) VALUES
('comment1', 'user2', 'post1', 'This is a very interesting post!'),
('comment2', 'user1', 'post2', 'Great tips for staying healthy!'),
('comment3', 'user3', 'post3', 'I love these ideas! (bdal garo b massassa).'),
('comment4', 'user4', 'post1', 'AI ghaydina lkhadma'),
('comment5', 'user5', 'post2', 'Dawach blma lbared fchta.');

-- add sample like/dislike
INSERT INTO likeAndDislike (likeAndDislike_id, user_id, post_id, comment_id) VALUES
('ld1', 'user1', 'post1', NULL),
('ld2', 'user2', 'post2', 'comment1'),
('ld3', 'user3', 'post3', 'comment3'),
('ld4', 'user4', 'post1', 'comment4'),
('ld5', 'user5', 'post2', 'comment5');