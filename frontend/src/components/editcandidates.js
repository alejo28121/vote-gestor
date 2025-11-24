import '../assets/styles/candidates.css'
import DropIcon from '../assets/icons/drop.svg'
import { useState } from 'react';

function Candidates({candidates}) {
    const [listValue, setListValue] = useState(0);
    return (
        <div className="list-votes">
            <h2 className="Vote-title">Candidatos</h2>
            <div className="Container-candidates">
                <div className="Item">
                    <div className="Title-item-container">
                        <h3 className="Title-item">Candidatos Presidenciales</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(1)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 1 ? '-1' : ''}`}>
                        {Object.entries(candidates).map(([candidate]) => (
                            <p className='Candidate-name' key={candidate}>
                                {candidate}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="Item">
                    <div className="Title-item-container">
                        <h3 className="Title-item">Candidatos a Camara</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(2)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 2? '-2' : ''}`}>
                        <p>Hola como estas como te llamas</p>
                    </div>
                </div>
                <div className="Item">
                    <div className="Title-item-container">
                        <h3 className="Title-item">Candidatos a Concejo</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(3)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 3? '-3' : ''}`}>
                        <p>Hola como estas como te llamas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Candidates;
