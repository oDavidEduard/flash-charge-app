require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/",(req,res) => {
    res.json({ message: "API Funcionando!" });
});

app.get('/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const chargerCount = await prisma.charger.count();
    
    res.json({ 
      message: "Prisma conectado", 
      users: userCount,
      chargers: chargerCount
    });
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
    res.status(500).json({ 
      message: "Erro ao conectar no banco", 
      error: error.message 
    });
  }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Prisma Studio: npx prisma studio`);
});

process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

