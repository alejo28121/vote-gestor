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
  console.log("📥 BODY RECIBIDO DESDE REACT:", req.body); // <-- LOG IMPORTANTE

  try {
    const result = JSON.parse(await runCprogram("./test.exe", req.body));

    console.log("📤 RESPUESTA DEL PROGRAMA C:", result); // <-- LOG OPCIONAL

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

// <-- Este enpoint Sumar 1 en el CSV del   voto y  marca al usuario como "ya votó"

app.post("/regisvote", async (req, res) => {
  console.log("📥 BODY RECIBIDO PARA REGISTRAR VOTO:", req.body);

  try {
    const result = JSON.parse(
      await runCprogram("./test.exe", {
        ...req.body,
        function: "RegisVotes",
      })
    );

    console.log("📤 RESPUESTA REGIS VOTE:", result);

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

/**
 *  🔍 VALIDAR SI EL USUARIO YA VOTÓ NO VOTO Y SI NO NO ESTA EN LA BASE DE DATOS
 *  Revisa el CSV users.csv para saber si el usuario tiene "ya votó = sí".
 */
app.post("/validatevote", async (req, res) => {
  console.log("📥 BODY RECIBIDO PARA VALIDAR VOTO:", req.body);

  try {
    const result = JSON.parse(
      await runCprogram("./test.exe", {
        ...req.body,
        function: "ValidateVote", // indica al programa C que valide el estado del voto
      })
    );

    console.log("📤 RESPUESTA VALIDATE VOTE:", result);

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
