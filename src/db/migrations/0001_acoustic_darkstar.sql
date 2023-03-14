ALTER TABLE comments MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());
ALTER TABLE posts MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());