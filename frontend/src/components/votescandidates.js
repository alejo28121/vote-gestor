import '../assets/styles/candidates.css'
import DropIcon from '../assets/icons/drop.svg'
import { useState, useEffect } from 'react';

function Candidates({candidates, onChangeValue}) {
    const [listValue, setListValue] = useState(0);
    const [state, setState] = useState(0);
    const [city, setCity] = useState('PE');
    const [dates, setDates] = useState({});
    useEffect(() => {
        const fetchDepartaments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/departaments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setDates(data); 
                } else {
                    alert("Error obteniendo departamentos");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        };
        fetchDepartaments();
    }, []);
    return (
        <div className="list-votes-2">
            <h2 className="Vote-title">Votos</h2>
            <div className="Container-candidates">
                <div className="Item">
                    <div className={`Title-item-container${listValue === 1 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos Presidenciales</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(1)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 1 ? '-1' : ''}`}>
                        {candidates.filter(dates => dates.tipo === 1).map(item => (
                            <div className='Item-check' key={item.candidate}>
                                <p className='Candidate-name' >
                                    {item.candidate} : {item.votes} votos
                                </p>
                            </div>
                        ))}
                        
                    </div>
                </div>
                <div className="Item">
                    <div className={`Title-item-container${listValue === 2 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos a Camara</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(2)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 2? '-2' : ''}`}>
                        {candidates.filter(dates => dates.tipo === 2).map(item => (
                            <div className='Item-check' key={item.candidate}>
                                <p className='Candidate-name' >
                                    {item.candidate} : {item.votes} votos
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="Item">
                    <div className={`Title-item-container${listValue === 3 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos a Concejo</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(3)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 3? '-3' : ''}`}>
                        <div className='List-container-state'>
                            <select className='List' onChange={(e) => setState(Number(e.target.value))}>
                                <option value='' disabled>Departamento</option>
                                {dates.departamentos?.map((value, index) => (
                                    <option key={index} value={index}>{value.name}</option>
                                ))}
                            </select>
                            <select className='List' onChange={(e) => {setCity(e.target.value)
                                onChangeValue(e.target.value)}
                            }>
                                <option value='' disabled>Municipio o ciudad</option>
                                {dates.departamentos?.[Number(state)].municipios?.map((value, index) => (
                                    <option key={index} value={value.code}>{value.name}</option>
                                ))}
                            </select>
                        </div>
                        {candidates.filter(dates => dates.tipo === 3).filter(date => date.zone === city).map(item => (
                            <div className='Item-check' key={item.candidate}>
                                <p className='Candidate-name' >
                                    {item.candidate} : {item.votes} votos
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Candidates;
