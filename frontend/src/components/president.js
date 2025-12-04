import Daniel from '../assets/images/Daniel.svg'
import Ivan from '../assets/images/Ivan.svg'
import Diana from '../assets/images/Diana.svg'
import Default from "../assets/icons/president.svg"
import Loading from './loading';
import { useState, useEffect, useRef } from 'react';
import {useNavigate, useLocation  } from 'react-router-dom';

function President(){
    const info = JSON.parse(localStorage.getItem('info'));
    const [votes, setVotes] = useState([]); 
    const socketRef = useRef(null);
    const [select, setSelect] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorValue, setErrorValue] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [munValue] = useState(info.municipio);
    const mode = location.state?.mode || 1;
    const [datesValue, setdatesValue] = useState({
        function : 'RegisVotes',
        candidate: '',
        user: info.user,
    }); 
    const images = {
        Diana,
        Daniel,
        Ivan,
        default: Default,
    };
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
    const SendDates = async () => {
        const MIN_TIME = 2000; 
        const start = Date.now();
        try{
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/regisvote`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(datesValue)
            });
            if(response.status === 200){
                setSelect(0);
                setErrorValue("");
            }else{
                setErrorValue("Usuario ya ha votado antes");
            }
        }catch(error){
            setErrorValue("Error en la solicitud");
        }finally{
            const elapsed = Date.now() - start;
            const remaining = MIN_TIME - elapsed;
            if (remaining > 0) {
                setTimeout(() => 
                    setLoading(false),
                    remaining);
                navigate('/votesystem/votemenu')
            }else{
                setLoading(false);
            }
        }
    }
    return(
        <div className="Container-menu-p">
            {loading ? (
                <Loading></Loading>
                ) : (
                <div className='presidents'>
                    {votes.filter(item => {
                        if(mode === 3){
                            return item.zone === munValue;
                        }
                        return true;
                    }).filter(item => (item.tipo) === mode).map((item, index) => (
                        <div key={item.candidate} className={`Vote-menu-${select === index + 1 ? 's' : 'p'}`} onClick={(e) => {
                                setdatesValue({
                                    ...datesValue,
                                    candidate: item.candidate
                                })
                                setSelect(index + 1)
                            }
                            }>
                            <span className='Candidate-number'>Candidato #{index + 1}</span>
                            <div className='Back-candidate'>
                                <img className='Img-candidate' src={images[item.img]} alt='Candidate'></img>
                            </div>
                            <span className='Candidate-name'>{item.candidate}</span>
                        </div>
                    ))}
                </div>
                )}
            <div className='Container-send-vote'>
                <span className='Error'>{errorValue}</span>
                <button className='Button-send' onClick={() => { 
                    if(select !== 0){
                        SendDates()
                    }
                }}>Votar</button>
            </div>
        </div>
    );
}
export default President;