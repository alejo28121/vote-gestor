import { useState, useEffect, useRef } from 'react';
import '../assets/styles/admin.css';
import PieChart from './circular';
import BarChart from './Bar';
import EditCandidates from './editcandidates'
import VoteCandidates from './votescandidates'
import { Outlet } from 'react-router-dom';
import Candidates from './editcandidates';

function Dashboard() {
    const [votes, setVotes] = useState([]); 
    const [diagram, setDiagram] = useState("1");
    const [candidate, setCandidate] = useState("1");
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
                    setVotes(data.votes);
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
    console.log(candidate === "2" ? votes.filter(item => item.tipo === 2).map(v => v.votes) : '')
    return (
        <div className='Main-dashboard'>
            <div className='Items-container'>
                <VoteCandidates candidates={votes}></VoteCandidates>
                <div className='list-votes'>
                    <h2 className='Vote-title'>Diagrama</h2>
                    <div className='List-container'>
                        <select className='List' onChange={(e) => setDiagram(e.target.value)}>
                            <option value={"1"}>Diagrama de torta</option>
                            <option value={"2"}>Diagrama de barras</option>
                        </select>
                        <select className='List' onChange={(e) => setCandidate(e.target.value)}>
                            <option value={"1"}>Presidencia</option>
                            <option value={"3"}>Concejo</option>
                            <option value={"2"}>Camara</option>
                        </select>
                    </div>
                    {diagram === "1" ? (
                        <PieChart 
                            labels={votes.filter(item => item.tipo === parseInt(candidate)).map(v => v.candidate)}
                            data={votes.filter(item => item.tipo === parseInt(candidate)).map(v => v.votes)}
                        />
                        ) : (
                        <BarChart
                            labels={votes.filter(item => item.tipo === parseInt(candidate)).map(v => v.candidate)}
                            data={votes.filter(item => item.tipo === parseInt(candidate)).map(v => v.votes)}
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
