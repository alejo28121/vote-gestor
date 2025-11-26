import '../assets/styles/editcandidate.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCandidates(){
    const [formValues, setFormValues] = useState({
        tipo: '',
        name: '',
        img : 'default'
    });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/regiscandidate`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formValues)
            });
            const data = await response.json();
            if (data.status === 'ok') {
                alert("Candidato registrado correctamente");
                navigate('/votesystem/dashboard');
            } else {
                alert(data.message || "Error al registrar el candidato");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    return(
        <div className='Main-add-container'>
            <div className='Add-container'>
                <div className='Title-add-content'>
                    <h3 className='Title-add-content'>Agregar Candidato</h3>
                </div>
                <div className='Input-container'>
                    <input className='Input-name' name='name' value={formValues.name} required onChange={(e) => {
                        const { name, value } = e.target;
                        setFormValues(prev => ({
                            ...prev,
                            [name]: value.toUpperCase()
                        }));
                    }} placeholder='Nombre del Candidato'></input>
                </div>
                <div className='Input-container'>
                    <select className='List-add' name='tipo' value={formValues.tipo} onChange={(e) => {
                        const { name, value } = e.target;
                        setFormValues(prev => ({
                            ...prev,
                            [name]: value
                        }));
                        }} required>
                        <option value={"0"}>Seleccione el rol</option>
                        <option value={"1"}>Presidente</option>
                        <option value={"2"}>Senador</option>
                        <option value={"3"}>Concejal</option>
                    </select>
                </div>
                <div className='Buttons-container'>
                    <button disabled={formValues.tipo === '' || formValues.name === ''} className='Add-button' onClick={handleSubmit}>Agregar</button>
                </div>
            </div>
        </div>
    );
}
export default AddCandidates;