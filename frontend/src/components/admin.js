import { useState, useEffect, useRef } from 'react';
import '../assets/styles/admin.css';
import PieChart from './circular';
import BarChart from './Bar';
import EditCandidates from './editcandidates'
import { Outlet } from 'react-router-dom';

function Dashboard() {
    const [votes, setVotes] = useState({}); 
    const [diagram, setDiagram] = useState("1");
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
                    <div className='List-container'>
                        <select className='List' onChange={(e) => setDiagram(e.target.value)}>
                            <option value={"1"}>Diagrama de torta</option>
                            <option value={"2"}>Diagrama de barras</option>
                        </select>
                    </div>
                    {diagram === "1" ? (
                        <PieChart
                            labels={Object.keys(votes)} 
                            data={Object.values(votes)} 
                        />
                        ) : (
                        <BarChart
                            labels={Object.keys(votes)} 
                            data={Object.values(votes)} 
                        />
                    )}
                </div>
                <EditCandidates candidates={votes}></EditCandidates>
            </div>
            <Outlet/>
        </div>
    );
}

export default Dashboard;
