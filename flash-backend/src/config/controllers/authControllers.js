import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "6831_3032_2025";

const prisma = new PrismaClient();

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },

        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ error: "Todos os campos são obrigatorios." });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser){
            return res.status(400).json({ error: "Esse email já está cadastrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: passwordHash,
                role: "USER"
            },
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        const token = generateToken(newUser);

        res.status(201).json({

            message: "Usuario criado.",
            user: newUser,
            token

        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ error: "Erro ao criar usuario" });
    }
}

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ error: "Todos os campos são obrigatorios" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        const isPasswordCorret = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordCorret){
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login realizado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: token,
        });

    } catch (error) {
        console.error("Erro no login: ",error);
        res.status(500).json({ error: "Erro fatal." });
    }
}

export const verifyToken = async (req,res) => {
    try {
        
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if(!user){
            return res.status(404).json({ error: "Usuario não encontrado" });
        }

        res.json({ user });

    } catch (error) {
        console.error("Erro ao verificar token:", error);
        res.status(500).json({ error: "Erro ao verificar token" });
    }
}

