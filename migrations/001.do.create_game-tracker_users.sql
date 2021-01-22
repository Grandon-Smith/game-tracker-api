CREATE TABLE game_tracker_users (
    email TEXT PRIMARY KEY UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);