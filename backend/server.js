const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { spawn } = require("child_process");

app.use(express.json());
app.use(cors());

function runCprogram(path, inputData) {
    return new Promise((resolve, reject) => {
        const child = spawn(path);
        let output = "";
        let errorOutput = "";

        child.stdout.on("data", (data) => {
        output += data.toString();
        });

        child.stderr.on("data", (data) => {
        errorOutput += data.toString();
        });

        child.on("close", (code) => {
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
    console.log("Escuchando...");
});

app.post("/login", async (req, res) => {
    console.log("📥 BODY RECIBIDO DESDE REACT:", req.body);

    try {
        const result = JSON.parse(await runCprogram("./test.exe", req.body));

        console.log("📤 RESPUESTA DEL PROGRAMA C:", result);

        if (result.status === "ok") {
        res.status(200).json(result);
        } else {
        res.status(401).json(result);
        }
    } catch (error) {
        console.error("❌ ERROR EN /login:", error);
        res.status(500).json({ error: error });
    }
});

app.post("/regisvote", async (req, res) => {
    console.log("BODY RECIBIDO PARA REGISTRAR VOTO:", req.body);

    try {
        const result = JSON.parse(
        await runCprogram("./test.exe", {
            ...req.body,
            function: "RegisVotes",
        })
        );

        console.log("RESPUESTA REGIS VOTE:", result);

        if (result.status === "ok") {
        res.status(200).json(result);
        } else {
        res.status(401).json(result);
        }
    } catch (err) {
        console.error(" ERROR EN /regisvote:", err);
        res.status(500).json({ error: err });
    }
});
app.post("/regiscandidate", async (req, res) => {
    console.log("BODY RECIBIDO PARA REGISTRAR VOTO:", req.body);

    try {
        const result = JSON.parse(
        await runCprogram("./test.exe", {
            ...req.body,
            function: "RegisCandidate",
        })
        );

        console.log("RESPUESTA REGIS VOTE:", result);

        if (result.status === "ok") {
        res.status(200).json(result);
        } else {
        res.status(401).json(result);
        }
    } catch (err) {
        console.error(" ERROR EN /regisvote:", err);
        res.status(500).json({ error: err });
    }
});

app.post("/validatevote", async (req, res) => {
    console.log("BODY RECIBIDO PARA VALIDAR VOTO:", req.body);

    try {
        const result = JSON.parse(
        await runCprogram("./test.exe", {
            ...req.body,
            function: "ValidateVote",
        })
        );

        console.log("RESPUESTA VALIDATE VOTE:", result);

        if (result.status === "ok") {
        res.status(200).json(result);
        } else {
        res.status(401).json(result);
        }
    } catch (err) {
        console.error(" ERROR EN /validatevote:", err);
        res.status(500).json({ error: err });
    }
});
app.post("/deletecandidate", async (req, res) => {
    console.log("BODY RECIBIDO PARA VALIDAR VOTO:", req.body);

    try {
        const result = JSON.parse(
        await runCprogram("./test.exe", {
            ...req.body,
            function: "EliminarCandidato",
        })
        );

        console.log("RESPUESTA VALIDATE VOTE:", result);

        if (result.status === "ok") {
        res.status(200).json(result);
        } else {
        res.status(401).json(result);
        }
    } catch (err) {
        console.error(" ERROR EN /EliminarCandidato:", err);
        res.status(500).json({ error: err });
    }
});
