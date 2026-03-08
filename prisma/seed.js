const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    const adminEmail = 'admin@gbiblio.com';
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Administrator',
            password: hashedPassword,
            username: 'admin',
        },
    });

    console.log(`✅ Admin user created/verified: ${adminUser.email}`);
    console.log('----------------------------------------------------');
    console.log(`🔒 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${plainPassword}`);
    console.log('----------------------------------------------------');
}

main()
    .catch((e) => {
        console.error('❌ Error during database seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🌱 Seeding finished.');
    });
