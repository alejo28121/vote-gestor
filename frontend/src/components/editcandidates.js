import '../assets/styles/candidates.css'
import DropIcon from '../assets/icons/drop.svg'
import Edit from '../assets/icons/edit.svg'
import Delete from '../assets/icons/delete.svg'
import Add from '../assets/icons/add.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Candidates({ candidates }) {
    const [listValue, setListValue] = useState(0);
    const [edit, setEdit] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!selectedCandidate) return; 

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deletecandidate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate: selectedCandidate }),
            });

            if (response.ok) {
                console.log('Candidato eliminado');
                setSelectedCandidate(''); 
            } else {
                console.error('Error al eliminar candidato');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const renderCandidates = (tipo) => (
        candidates.filter(item => item.tipo === tipo).map(item => (
            <div className='Item-check' key={item.candidate}>
                <p className='Candidate-name'>{item.candidate}</p>
                <input
                    type='checkbox'
                    className={`check${edit ? '' : '-o'}`}
                    checked={selectedCandidate === item.candidate}
                    onChange={() => setSelectedCandidate(item.candidate)}
                ></input>
            </div>
        ))
    );

    return (
        <div className="list-votes">
            <h2 className="Vote-title">Candidatos</h2>
            <div className="Container-candidates">

                {/* Candidatos Presidenciales */}
                <div className="Item">
                    <div className={`Title-item-container${listValue === 1 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos Presidenciales</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() => setListValue(1)}></img>
                    </div>
                    <div className={`Items-container-list${listValue === 1 ? '-1' : ''}`}>
                        {renderCandidates(1)}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => setEdit(true)}></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete} onClick={handleDelete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add} onClick={() => navigate('/votesystem/dashboard/addcandidates')}></img>
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => setEdit(false)}>Guardar</button>
                        </div>
                    </div>
                </div>

                {/* Candidatos a Cámara */}
                <div className="Item">
                    <div className={`Title-item-container${listValue === 2 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos a Camara</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() => setListValue(2)}></img>
                    </div>
                    <div className={`Items-container-list${listValue === 2 ? '-2' : ''}`}>
                        {renderCandidates(2)}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => setEdit(true)}></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete} onClick={handleDelete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add} onClick={() => navigate('/votesystem/dashboard/addcandidates')}></img>
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => setEdit(false)}>Guardar</button>
                        </div>
                    </div>
                </div>

                {/* Candidatos a Concejo */}
                <div className="Item">
                    <div className={`Title-item-container${listValue === 3 ? '-s' : ''}`}>
                        <h3 className="Title-item">Candidatos a Concejo</h3>
                        <img className='Drop-icon' src={DropIcon} onClick={() => setListValue(3)}></img>
                    </div>
                    <div className={`Items-container-list${listValue === 3 ? '-3' : ''}`}>
                        {renderCandidates(3)}
                        <div className='Buttons-container'>
                            <img className={`Edit-icon${edit ? '-c' : ''}`} src={Edit} onClick={() => setEdit(true)}></img>
                            <img className={`Delete-icon${edit ? '-c' : ''}`} src={Delete} onClick={handleDelete}></img>
                            <img className={`Add-icon${edit ? '-c' : ''}`} src={Add} onClick={() => navigate('/votesystem/dashboard/addcandidates')}></img>
                        </div>
                        <div className={`Buttons-sucess${edit ? '-c' : ''}`}>
                            <button className='Save-button' onClick={() => setEdit(false)}>Guardar</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Candidates;
