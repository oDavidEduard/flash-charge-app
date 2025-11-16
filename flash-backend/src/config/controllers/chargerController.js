import { PrismaClient } from "@prisma/client";
import { distanceCalc } from "../../utils/distance.js";

const prisma = new PrismaClient();

export const chargerList = async (req,res) => {
    try {
        
        const { lat, lng, radius } = req.query;

        const chargers = await prisma.charger.findMany({
            where: { available: true },
            include: {
                submittedBy: {
                    select: { name: true }
                }
            }
        });

        if (lat && lng){
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const maxRadius = radius ? parseFloat(radius) : 10;

            const filteredChargers = chargers
                .map(charger => {

                    const distance = distanceCalc(
                        userLat,
                        userLng,
                        parseFloat(charger.latitude),
                        parseFloat(charger.longitude)
                    );

                    return { ...charger, distance};
                })
                .filter(c => c.distance <= maxRadius)
                .sort((a, b) => a.distance - b.distance);

                return res.json(filteredChargers);
        }

        res.json(chargers);

    } catch (error) {
        console.error("Erro ao listar carregadores", error);
        res.status(500).json({ error: "Erro ao buscar carregadores" });
    }
}

export const getCharger = async (req,res) => {
    try {
        const { id } = req.params;

        const charger = await prisma.charger.findUnique({
            where: { id: parseInt(id) },
            include: {
                submittedBy: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        if (!charger){
            return res.status(404).json({ error: "Carregador não encontrado" });
        }

        res.json(charger);

    } catch (error) {
        console.error("Erro ao buscar carregador", error);
        res.status(500).json({ error: "Erro ao buscar carregador." });
    }
}

