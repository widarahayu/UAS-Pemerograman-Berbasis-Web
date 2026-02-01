const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@movieku.com' },
        update: {},
        create: {
            email: 'admin@movieku.com',
            name: 'Admin MovieKu',
            password: password,
            role: 'ADMIN',
        },
    });

    // Create User
    const user = await prisma.user.upsert({
        where: { email: 'user@movieku.com' },
        update: {},
        create: {
            email: 'user@movieku.com',
            name: 'User MovieKu',
            password: password,
            role: 'USER',
        },
    });

    console.log({ admin, user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
