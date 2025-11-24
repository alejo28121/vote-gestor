import '../assets/styles/login.css'
import View from '../assets/icons/visibility.svg'
import ViewOff from '../assets/icons/visibility_off.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [visibilityState, setVisibilityState] = useState(false);
    const [formValues, setFormValues] = useState({
        user: '',
        password: '',
        function: 'RegisUser',
        role: '2',
        voted: 'no'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/regisuser`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formValues)
            });
            const data = await response.json();
            if (data.status === 'ok') {
                alert("Usuario registrado correctamente");
                navigate('/');
            } else {
                alert(data.message || "Error al registrar el usuario");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="Main-login-container">
            <div className='Form-login-container'>
                <form className='Form-login' onSubmit={handleSubmit}>
                    <div className='Title-container'>
                        <h1 className='Title-text'>Registro</h1>
                    </div>
                    <div className='Cc-container'>
                        <input
                            className='Input-cc'
                            type='number'
                            placeholder='Documento de identificación'
                            onChange={(e) => setFormValues(prev => ({ ...prev, user: e.target.value }))}
                        />
                    </div>
                    <div className='Password-container'>
                        <input
                            className='Input-Password'
                            placeholder='Contraseña'
                            type={visibilityState ? 'text' : 'password'}
                            onChange={(e) => setFormValues(prev => ({ ...prev, password: e.target.value }))}
                        />
                        <img
                            className='Visibility-icon'
                            src={visibilityState ? ViewOff : View} alt='Icon'
                            onClick={() => setVisibilityState(!visibilityState)}
                        />
                    </div>
                    <div className='Button-container'>
                        <button className='Button-sigin' type='submit'>Registrar</button>
                    </div>
                    <div className='Create-content'>
                        <span>¿Ya tienes cuenta?</span>
                        <span className='Sing-up' onClick={() => navigate('/')}>Inicia sesión</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
