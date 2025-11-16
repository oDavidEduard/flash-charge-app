import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRequest = async (req,res) => {
    try {
        
        const { name, address, latitude, longitude, chargerType, powerKw, pricePerKwh } = req.body;

        if (!name || !address || !chargerType || !powerKw || !pricePerKwh){

            return res.status(400).json({ error: "Preencha todos os campos." });

        }

        const userId = req.userId;

        const newRequest = await prisma.chargerRequest.create({
            data: {
                name: name,
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                chargerType: chargerType,
                powerKw: parseFloat(powerKw),
                pricePerKwh: pricePerKwh ? parseFloat(pricePerKwh) : null,
                submittedById: userId
            },

            include: {
                submittedBy:{
                    select:{
                        id: true,
                        name: true,
                        email:true
                    }
                }
            }
        });

        res.status(201).json({ message: "Solicitação criada com sucesso!", request: newRequest });

    } catch (error) {
        console.error("Não foi possivel realizar a solicitação", error);
        res.status(500).json({ error: "Erro ao criar solicitação" });
    }
}

export const listMyRequests = async (req,res) => {
    try {

        const userId = req.userId;

        const requests = await prisma.chargerRequest.findMany({
            where: { submittedById: userId },
            orderBy: { createdAt: "desc" },
            include: {
                reviewedBy:{
                    select: { name: true }
                }
            }
        });

        res.json(requests);

    } catch (error) {
        console.error("Erro ao listar solicitações", error);
        res.status(500).json({ error: "Erro ao listar solicitações" });
    }
}

export const listPendingRequests = async (req,res) => {
    try {
        
        const requests = await prisma.chargerRequest.findMany({
            where: { status: "PENDING"},
            orderBy: {createdAt: "desc"},
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(requests);
    } catch (error) {
        console.error("Erro ao listar solicitações", error);
        res.status(500).json({ error: "Erro ao listar solicitações" });
    }
}

export const aproveRequest = async (req,res) => {
    try {
        const { id } = req.params;
        const adminId = req.userId;

        const request = await prisma.chargerRequest.findUnique({
            where: { id: parseInt(id) }
        });

        if(!request){
            return res.status(404).json({ error: "Solicitação não encontrada" });
        }

        if(request.status !== "PENDING"){
            return res.status(400).json({ error: "Apenas solicitações pendentes podem ser aprovadas" });
        }

        const result = await prisma.$transaction(async (tx) => {

            const newCharger = await tx.charger.create({
                data: {
                    name: request.name,
                    address: request.address,
                    latitude: request.latitude,
                    longitude: request.longitude,
                    chargerType: request.chargerType,
                    powerKw: request.powerKw,
                    pricePerKwh: request.pricePerKwh,
                    submittedById: request.submittedById
                }
            });

            const updatedRequest = await tx.chargerRequest.update({
                where: { id: parseInt(id) },
                data: {
                    status: "APPROVED",
                    reviewedById: adminId,
                    reviewedAt: new Date()
                }
            });

            return { newCharger, updatedRequest };
        });

        res.json({
            message: "Solicitação aprovada com sucesso",
            charger: result.newCharger,
            request: result.updatedRequest
        });

    } catch (error) {
        console.error("Erro ao aprovar solicitações", error);
        res.status(500).json({ error: "Erro ao aprovar solicitações" });
    }
}

export const rejectRequest = async (req,res) => {

    try {

        const { id } = req.params;
        const adminId = req.userId;
        
        const request = await prisma.chargerRequest.findUnique({
            where: { id: parseInt(id) }
        });

        if(!request){
            return res.status(404).json({ error: "Solicitação não encontrada." });
        }

        if(request.status !== "PENDING"){
            return res.status(400).json({ error: "Apenas solicitações pendentes podem ser aprovadas" });
        }

        const updatedRequest = await prisma.chargerRequest.update({
            where: { id: parseInt(id) },
            data: {
                status: "REJECTED",
                reviewedById: adminId,
                reviewedAt: new Date()
            },

            include: {
                submittedBy: { select: { name: true, email: true } },
                reviewedBy: { select: { name: true } }
            }
        });

        res.json({
            message: "Solicitação rejeitada",
            request: updatedRequest
        });
        
    } catch (error) {
        console.error("Erro ao rejeitar solicitação", error);
        res.status(500).json({ error: "Erro ao rejeitar solicitação" });
    }
}