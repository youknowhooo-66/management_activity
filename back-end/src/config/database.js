import mysql from 'mysql2/promise';
import { env } from '../../env.js';

// Configuração do Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'senai',
  database: process.env.DB_NAME || 'agendamento_db',
  waitForConnections: true,
  connectionLimit: 10, // Máximo de 10 pessoas conectadas simultaneamente
  queueLimit: 0
});

// Teste de conexão imediato
try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado ao MySQL com sucesso!");
    connection.release(); // Libera a conexão de teste
} catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error.message);
}

export default pool;