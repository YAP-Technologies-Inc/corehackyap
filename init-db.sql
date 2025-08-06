-- Initialize YAP Database Schema
-- This script runs automatically when the PostgreSQL container starts

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(42) PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    language_to_learn VARCHAR(50) DEFAULT 'spanish'
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS user_lessons (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(42) REFERENCES users(user_id),
    lesson_id VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tokens_earned INTEGER DEFAULT 1,
    UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_lesson_id ON user_lessons(lesson_id);

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'YAP Database schema initialized successfully';
END $$; 