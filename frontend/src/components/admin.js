import { useState, useEffect, useRef } from 'react';
import '../assets/styles/admin.css';
import PieChart from './circular';

function Dashboard() {
    const [votes, setVotes] = useState({}); 
    const socketRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/socket");
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("Conectado al WebSocket");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.votes) { 
                    setVotes(prev => {
                        const newVotes = { ...prev };
                        data.votes.forEach(item => {
                            newVotes[item.candidate] = item.votes; 
                        });
                        return newVotes;
                    });
                }
            } catch {
                console.log("Mensaje no JSON:", event.data);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket cerrado");
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []);
    return (
        <div className='Main-dashboard'>
            <div className='Items-container'>
                <div className='list-votes'>
                    <h2 className='Vote-title'>Votos por candidato</h2>
                        {Object.entries(votes).map(([candidate, count]) => (
                            <p className='Votes-text' key={candidate}>
                                {candidate}: {count} votos
                            </p>
                        ))}
                </div>
                <div className='list-votes'>
                    <h2 className='Vote-title'>Diagrama</h2>
                    <PieChart
                        labels={Object.keys(votes)} 
                        data={Object.values(votes)} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
