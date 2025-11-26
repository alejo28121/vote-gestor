import '../assets/styles/candidates.css'
import DropIcon from '../assets/icons/drop.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Candidates({candidates}) {
    const [listValue, setListValue] = useState(0);
    const navigate = useNavigate();
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
                        {candidates.filter(dates => dates.tipo === 3).map(item => (
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
