import { db } from './connection';

export async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Create a test user (optional)
    const testUserQuery = `
      INSERT INTO users (email, password_hash) 
      VALUES ('test@example.com', '$2a$10$example.hash.here') 
      ON CONFLICT (email) DO NOTHING
    `;
    
    await db.query(testUserQuery);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}