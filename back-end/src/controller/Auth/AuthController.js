import { prisma } from '../../config/prismaClient.js';
import bscrypt from "bscrypt";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefresh,
} from "../../utils/jwt.js";
import { hashPassword } from '../../utils/hash.js';

class AuthController {
    constructor() {}
    async register(
        req,
        res
    ) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Email e senha são obrigatórios" })
            }
            const usuarioExiste = await prisma.user.findUnique({
                where: {email},
            });
            if (usuarioExiste) return res.status(409).json({ error: "Usuário já existe" });
            const hashedSenha = await hashPassword(password);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedSenha,
                    name: name || "Novo Cliente"
                },
                select: { id: true, email: true, name: true},
            });
            return res.status(201).json(user)
        } catch (e) {
            console.error("Erro no reistro:", e);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    };

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await prisma.user.findUnique({ where: { email } }); 

            // util/hash.js
            if (!user || !(await comparePassword(password, user.password))) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
            
            // USANDO SEUS UTILITÁRIOS DE TOKEN (generateAccessToken)
            const payload = { userId: user.id, email: user.email, name: user.name, role: user.role };
            const accessToken = signAccessToken(payload);
            const refreshToken = signRefreshToken(payload);
            
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias para o Refresh Token
            
            await prisma.token.create({
                data: {
                    token: refreshToken,
                    type: TokenType.REFRESH,
                    expiresAt,
                    user: { connect: { id: user.id } },
                },
            });
            
            res.status(200).json({
                accessToken,
                refreshToken,
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
            });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    };
    
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Token necessário" });

        const storedRefreshToken = await prisma.token.findFirst({ 
            where: { token: refreshToken, revoked: false } 
        });
        
        if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
            return res.status(401).json({ error: "Refresh token inválido ou expirado" });
        }

        try {
            // verifyToken (passando true para usar a secret de refresh)
            const payload = verifyRefresh(refreshToken, true);
            if (!payload) throw new Error();

            const newAccessToken = signAccessToken({ 
                userId: payload.userId, 
                email: payload.email, 
                name: payload.name 
            });

            return res.json({ accessToken: newAccessToken });
        } catch {
            return res.status(401).json({ error: "Token inválido" });
        }
    };

    async logout(req, res) {
        const { refreshToken } = req.body;
        try {
            await prisma.token.updateMany({
                where: { token: refreshToken },
                data: { revoked: true },
            });
            return res.status(200).json("Usuário deslogado!");
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deslogar" });
        }
    }
}

export const authController = new AuthController();