import { db } from './connection';

const migrations = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS oracle_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    emotion_analysis JSONB NOT NULL,
    earth_data JSONB NOT NULL,
    narrative TEXT NOT NULL,
    vibe_score INTEGER NOT NULL CHECK (vibe_score >= 0 AND vibe_score <= 100),
    insights JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_oracle_responses_user_id ON oracle_responses(user_id);
  CREATE INDEX IF NOT EXISTS idx_oracle_responses_created_at ON oracle_responses(created_at);
  CREATE INDEX IF NOT EXISTS idx_oracle_responses_public ON oracle_responses(is_public);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `
];

export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    for (const migration of migrations) {
      await db.query(migration);
    }
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}