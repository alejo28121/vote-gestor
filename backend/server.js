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

app.post("/login", async (req, res) => {
    try{
        const result = JSON.parse(await runCprogram("./test", req.body));
        if (result.status === "ok") {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    }catch(error){
        res.status(500).json({ error: error});
    }
})
app.post("/regisvote", async (req, res) => {
    try{
        const result = JSON.parse(await runCprogram("./test", req.body));
        if (result.status === "ok") {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    }catch(error){
        res.status(500).json({ error: error});
    }
})
app.post("/regisuser", async (req, res) => {
    try{
        const result = JSON.parse(await runCprogram("./test", req.body));
        if (result.status === "ok") {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    }catch(error){
        res.status(500).json({ error: error});
    }
})