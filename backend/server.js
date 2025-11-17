const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, process.env.URL, () => {
    console.log('Escuchando...');
});

app.post("/test", async (req, res) => {
    try{
        const result = await runCprogram("./test", req.body);
        res.json(JSON.parse(result));
    }catch(error){
        res.status(500).json({ error: error});
    }
})