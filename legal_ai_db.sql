-- ============================================
-- LEGAL AI ASSISTANT - DATABASE SCHEMA
-- Run this entire block at once in pgAdmin
-- ============================================

-- STEP 1: Create the ENUM type for user roles
-- An ENUM is like a dropdown — it only allows specific values.
-- This prevents someone from setting role = 'hacker' in your DB.
CREATE TYPE user_role AS ENUM ('lawyer', 'worker');

-- ============================================
-- TABLE 1: users
-- This is the central table. Every person who logs in
-- has a record here, regardless of whether they're a
-- lawyer or a worker.
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,          -- Auto-incrementing unique ID for each user
    email VARCHAR(255) UNIQUE NOT NULL,  -- Email must be unique (no duplicates) and required
    password_hash VARCHAR(255) NOT NULL, -- We NEVER store plain passwords. Only hashed versions.
    role user_role NOT NULL,             -- Must be either 'lawyer' or 'worker'
    full_name VARCHAR(255) NOT NULL,     -- User's display name
    is_active BOOLEAN DEFAULT TRUE,      -- Can be set to FALSE to disable an account
    created_at TIMESTAMP DEFAULT NOW(),  -- Automatically records when the account was created
    updated_at TIMESTAMP DEFAULT NOW()   -- Automatically records when the account was last updated
);

-- ============================================
-- TABLE 2: lawyers
-- Extended profile for users who are lawyers.
-- Linked to the users table via user_id.
-- ============================================
CREATE TABLE lawyers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- REFERENCES users(id): This is a Foreign Key — it means user_id MUST match an id in the users table
    -- ON DELETE CASCADE: If the user is deleted, this lawyer record is also automatically deleted
    bar_number VARCHAR(100) UNIQUE,     -- Bar registration number (unique per lawyer)
    specialization VARCHAR(255),         -- e.g., "Criminal Law", "Corporate Law"
    years_of_experience INTEGER DEFAULT 0,
    bio TEXT,                            -- TEXT allows long descriptions (no character limit)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 3: workers
-- Extended profile for users who are workers/staff.
-- They can use the system but NOT the AI features.
-- ============================================
CREATE TABLE workers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(255),             -- e.g., "Paralegal", "Admin", "Research"
    employee_id VARCHAR(100) UNIQUE,     -- Internal employee ID
    supervisor_id INTEGER REFERENCES users(id), -- Optional: who is their supervisor?
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 4: cases
-- Legal cases managed in the system.
-- Every case is assigned to a lawyer.
-- ============================================
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,  -- e.g., "CASE-2025-001"
    title VARCHAR(500) NOT NULL,               -- Short title of the case
    description TEXT,                          -- Full details of the case
    status VARCHAR(50) DEFAULT 'open',         -- 'open', 'closed', 'pending', 'archived'
    case_type VARCHAR(255),                    -- e.g., 'Criminal', 'Civil', 'Corporate'
    assigned_lawyer_id INTEGER NOT NULL REFERENCES users(id),
    -- This links to users table — the lawyer responsible for this case
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    priority VARCHAR(50) DEFAULT 'medium',     -- 'low', 'medium', 'high', 'urgent'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP                        -- NULL until case is closed
);

-- ============================================
-- TABLE 5: ai_conversations
-- Stores every AI chat session.
-- CRITICAL RULE: Only lawyers (role = 'lawyer') will
-- be allowed to create records here. We enforce this
-- in the backend API — not just the database.
-- ============================================
CREATE TABLE ai_conversations (
    id SERIAL PRIMARY KEY,
    lawyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Only a user who is a lawyer should appear here
    -- The backend will verify the user's role before inserting
    case_id INTEGER REFERENCES cases(id) ON DELETE SET NULL,
    -- Optional: a conversation can be linked to a specific case
    -- ON DELETE SET NULL: if the case is deleted, conversation stays but case_id becomes NULL
    title VARCHAR(500),                        -- e.g., "Research on contract breach"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 6: ai_messages
-- Stores individual messages within a conversation.
-- Each conversation (ai_conversations) has many messages.
-- ============================================
CREATE TABLE ai_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    -- Links to ai_conversations. If conversation deleted, all its messages are deleted too.
    role VARCHAR(50) NOT NULL,     -- 'user' (the lawyer's message) or 'assistant' (Claude's reply)
    content TEXT NOT NULL,         -- The actual message text
    tokens_used INTEGER,           -- How many API tokens this message consumed (for monitoring)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES: Speed up common database queries
-- Without indexes, every search scans the ENTIRE table.
-- With indexes, PostgreSQL can find rows instantly.
-- ============================================
CREATE INDEX idx_users_email ON users(email);           -- Fast login lookups by email
CREATE INDEX idx_users_role ON users(role);             -- Fast role-based filtering
CREATE INDEX idx_cases_lawyer ON cases(assigned_lawyer_id); -- Fast "get my cases" queries
CREATE INDEX idx_conversations_lawyer ON ai_conversations(lawyer_id); -- Fast conversation history
CREATE INDEX idx_messages_conversation ON ai_messages(conversation_id); -- Fast message loading

-- ============================================
-- VERIFICATION: Run this to confirm all tables were created
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;