const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

try {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace sqlite provider with postgresql
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  
  fs.writeFileSync(schemaPath, schema);
  console.log('✅ Successfully updated Prisma schema to use PostgreSQL for Railway deployment.');
} catch (error) {
  console.error('❌ Error updating Prisma schema:', error);
  process.exit(1);
}
