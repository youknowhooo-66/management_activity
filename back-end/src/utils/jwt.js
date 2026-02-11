import jwt from "jsonwebtoken";
import { env } from "../../env.js";

// Gera o Token de Acesso
export function signAccessToken(payload) {
    console.log(env)
    return jwt.sign(
        payload, env.accessSecret,
        {
            expiresIn: Number(env.accessTtl)

        });
}
// Gera o Token de Atualização (Refresh)
export function signRefreshToken(payload) {
    return jwt.sign(
        payload, env.refreshSecret,
        {
            expiresIn: Number(env.refreshTtl)

        });
}
// Verifica a validade do Access e Refresh
export function verifyAccess(token) {
    return jwt.verify(token, env.accessSecret);
}
export function verifyRefresh(token) {
    return jwt.verify(token, env.refreshSecret);
}
// Decodifica o token para ler o payload sem verificar
export function getToken(token) {
    const tokenWithoutBearer = token.slice("Bearer ".length);
    return jwt.decode(tokenWithoutBearer);
}