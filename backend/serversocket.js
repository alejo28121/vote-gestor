const WebSocket = require('ws');
const { spawn } = require('child_process');

const wss = new WebSocket.Server({ port: 8080, path: '/socket' });

console.log("WebSocket en ws://localhost:8080/socket");

wss.on('connection', (ws) => {
    console.log("Cliente conectado");
    ws.send(JSON.stringify({ msg: "Conexión establecida" }));
    const proceso = spawn('./socket.exe'); 
    console.log("Ejecutable iniciado para este cliente");
    proceso.stdout.on('data', (data) => {
        const text = data.toString();
        console.log("Salida del programa:", text);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(text);
        }
    });
    proceso.stderr.on('data', (data) => {
        console.error("Error del programa:", data.toString());
    });
    proceso.on('close', () => {
        console.log("Proceso C terminó");
    });
    ws.on('close', () => {
        console.log("Cliente desconectado, matando el proceso...");
        proceso.kill();  
    });
});
