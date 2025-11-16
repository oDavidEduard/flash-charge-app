export const adminMiddleware = async (req, res, next) => {
    if(req.userRole !== "ADMIN"){
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem acessar." });
    }

    next();

}
