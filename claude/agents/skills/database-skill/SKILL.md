---
name: database-skill
description: Create and manage database tables, migrations, and schema design. Supports PostgreSQL, MySQL, and SQLite. Use for building and maintaining relational databases.
---

# Database Skill

## Instructions

1. **Schema Design**
   - Define tables with clear primary keys and descriptive names
   - Use appropriate data types for each column
   - Normalize tables to reduce redundancy (up to 3NF)
   - Add indexes for frequently queried columns
   - Use default values where applicable

2. **Relationships**
   - Define one-to-one, one-to-many, and many-to-many relationships
   - Use foreign keys with proper `ON DELETE` / `ON UPDATE` behavior
   - Consider junction tables for many-to-many relationships
   - Use constraints to enforce referential integrity

3. **Migrations**
   - Create incremental migration scripts for schema changes
   - Keep migrations idempotent and reversible where possible
   - Test migrations on staging before production
   - Version control migration files for team collaboration
   - Roll back migrations safely in case of errors

4. **Data Integrity & Constraints**
   - Enforce `NOT NULL`, `UNIQUE`, `CHECK` constraints
   - Use triggers or stored procedures for automated actions
   - Validate data at the database layer, not just in application
   - Implement transactions for multi-step operations

5. **Multi-DB Considerations**
   - PostgreSQL: Use SERIAL / BIGSERIAL for auto-increment IDs, JSONB for semi-structured data
   - MySQL: Use InnoDB engine for foreign key support, optimize indexes
   - SQLite: Lightweight, good for testing; supports basic foreign keys with `PRAGMA foreign_keys = ON`

## Best Practices
- Keep table and column names consistent and descriptive
- Avoid storing calculated or redundant data
- Regularly review and optimize indexes and queries
- Document all schema changes and migration history
- Always use transactions for critical operations
- Backup database before major migrations
- Prefer parameterized queries to prevent SQL injection

## Migration Workflow Example
```sql
-- Create a new table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a new column in a migration
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Rename column in a migration
ALTER TABLE users RENAME COLUMN last_login TO last_active;

-- Rollback example (PostgreSQL)
ALTER TABLE users DROP COLUMN last_active;
