ALTER TABLE game_tracker_users
    ADD COLUMN email TEXT PRIMARY KEY UNIQUE NOT NULL;
