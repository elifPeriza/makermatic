CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`completed_at` text,
	`is_completed` integer DEFAULT 0 NOT NULL,
	`notes` text
);
