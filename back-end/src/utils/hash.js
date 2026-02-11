import bcrypt from "bcrypt";

const saltRounds = 10;

// Cria e exporta o hash para o banco
export const hashPassword = async (password) => { 
    return await bcrypt.hash(password, saltRounds);
}

// Compara a senha enviada com a salva
export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

// const isMatch = await bcrypt.compare("123456", hash); console.log("Validação:", isMatch);
// true