const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main(){
    console.log("Iniciando seed.")

    await prisma.chargerRequest.deleteMany();
    await prisma.charger.deleteMany();
    await prisma.user.deleteMany();
    console.log("Dados antigos removidos");

    const admin = await prisma.user.create({
        data:{
            name: "Admin",
            email: "admin@flashcharge.com",
            passwordHash: await bcrypt.hash("admin123", 10),
            role: "ADMIN",
        },
    });

    console.log("Admin criado");

    const user = await prisma.user.create({
        data:{
            name: "User",
            email: "user@email.com",
            passwordHash: await bcrypt.hash("user123", 10),
            role: "USER",
        },
    });

    console.log("Usuario comum criado");

    const chargers = [
        {
            name: "Shopping Midway Mall",
            address: "Av. Bernardo Vieira, 3775 - Tirol, Natal - RN",
            latitude: -5.8110,
            longitude: -35.2057,
            chargerType: "Tipo 2",
            powerKw: 22,
            pricePerKwh: 0.00,
            submittedById: admin.id,
        },

        {
            name: "Natal Shopping",
            address: "Av. Sen. Salgado Filho, 2234 - Candelária, Natal - RN",
            latitude: -5.8419,
            longitude: -35.2113,
            chargerType: "Tipo 2",
            powerKw: 22,
            pricePerKwh: 0.95,
            submittedById: admin.id,
        },
    ];

    await prisma.charger.createMany({
        data: chargers,
    });
    console.log(`${chargers.length} carregadores inseridos`);

    await prisma.chargerRequest.create({

        data: {
            name: "Shopping Cidade Jardim",
            address: "Av. Engenheiro Roberto Freire, 340 - Capim Macio, Natal - RN",
            latitude: -5.8509,
            longitude: -35.2050,
            chargerType: "Tipo 2",
            powerKw: 22,
            pricePerKwh: 0.95,
            status: "PENDING",
            submittedById: user.id,
        },

    });

    console.log("Solicitação pendente criada");

    console.log("Seed concluida")
    console.log("Credenciais:")
    console.log('Admin: admin@flashcharge.com / admin123');
    console.log('User:  user@email.com / user123');

}

main()
    .catch((e) => {
        console.error("Erro no seed", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })