CREATE TABLE `comments` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`post_id` int NOT NULL,
	`body` text NOT NULL,
	`created_at` timestamp DEFAULT (now())
);

CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`type` enum('weekly','monthly') DEFAULT 'weekly',
	`created_at` timestamp DEFAULT (now())
);

CREATE INDEX post_id_idx ON comments (`post_id`);