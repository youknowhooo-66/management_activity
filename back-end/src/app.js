import express from 'express';
import cors from 'cors';

const app = express();

import veiculoRouter from "./routes/veiculos.js"

app.use("/veiculo", veiculoRouter)
app.use(cors());
app.use(express.json);
// Exemplo Node.js

app.use(cors()); // Permite conexões do frontend

app.get('/api/dados', (req, res) => {
  res.json({ mensagem: "Conectado ao back!" });
});

app.listen(5000, () => console.log('Back rodando na porta 5000'));


app.get('/', (req, res) => {
    res.send('fala comigo')
})