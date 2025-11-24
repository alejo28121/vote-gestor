import '../assets/styles/candidates.css'
import DropIcon from '../assets/icons/drop.svg'
import Edit from '../assets/icons/edit.svg'
import Delete from '../assets/icons/delete.svg'
import Add from '../assets/icons/add.svg'
import { useState } from 'react';

function Candidates({candidates}) {
    const [listValue, setListValue] = useState(0);
    const [edit, setEdit] = useState(false);
    return (
        <div className="list-votes">
            <h2 className="Vote-title">Candidatos</h2>
            <div className="Container-candidates">
                <div className="Item">
                    <div className={`Title-item-container${listValue === 1 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos Presidenciales</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() =>
                            setListValue(1)
                        }></img>
                    </div>
                    <div className={`Items-container-list${listValue === 1 ? '-1' : ''}`}>
                        {Object.entries(candidates).map(([candidate]) => (
                            <div className='Item-check'>
                                <p className='Candidate-name' key={candidate}>
                                    {candidate}
                                </p>
                                <input type='checkbox' className={`check${edit ? '' : '-o'}`}></input>
                            </div>
                        ))}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => 
                                setEdit(true)
                            }></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add}></img>                            
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => 
                                setEdit(false)
                            }>Guardar</button>
                        </div>
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
                        {Object.entries(candidates).map(([candidate]) => (
                            <div className='Item-check'>
                                <p className='Candidate-name' key={candidate}>
                                    {candidate}
                                </p>
                                <input type='checkbox' className={`check${edit ? '' : '-o'}`}></input>
                            </div>
                        ))}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => 
                                setEdit(true)
                            }></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add}></img>                            
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => 
                                setEdit(false)
                            }>Guardar</button>
                        </div>
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
                        {Object.entries(candidates).map(([candidate]) => (
                            <div className='Item-check'>
                                <p className='Candidate-name' key={candidate}>
                                    {candidate}
                                </p>
                                <input type='checkbox' className={`check${edit ? '' : '-o'}`}></input>
                            </div>
                        ))}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => 
                                setEdit(true)
                            }></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add}></img>                            
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => 
                                setEdit(false)
                            }>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Candidates;
