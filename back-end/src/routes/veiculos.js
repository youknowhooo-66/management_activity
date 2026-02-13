import express from "express";

const veiculoRouter = express.Router();

router.get("/", async(req, res) => {
    const [results] = await database.query("SELECT * FROM veiculo where ativ = 1")
    res.send(results)
})

module.exports = veiculoRouter;