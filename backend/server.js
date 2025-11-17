const express = require('express');
const cors = require('cors');
const app = express();
require ('dotenv').config();
const { spawn } = require('child_process');

app.use(express.json());
app.use(cors());

function runCprogram(path, inputData) {
    return new Promise((resolve, reject) => {
        const child = spawn(path);

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(errorOutput || `C program exited with code ${code}`);
            } else {
                resolve(output);
            }
        });

        // enviar JSON al programa C si espera stdin
        if (inputData) {
            child.stdin.write(JSON.stringify(inputData));
        }
        child.stdin.end();
    });
}


app.listen(process.env.PORT, process.env.URL, () => {
    console.log(process.env.PORT);
    console.log(process.env.URL);
    console.log('Escuchando...');
});

app.get("/test", async (req, res) => {
    try{
        const result = await runCprogram("./test.exe", req.body);
        res.json(JSON.parse(result));
    }catch(error){
        res.status(500).json({ error: error});
    }
})