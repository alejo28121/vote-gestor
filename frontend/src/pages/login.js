import '../assets/styles/login.css'
import View from '../assets/icons/visibility.svg'
import ViewOff from '../assets/icons/visibility_off.svg'
import { useState } from 'react';

function Login (){
    const [visibilityState, setVisibilityState] = useState(false);
    const [datesValue, setdatesValue] = useState({
        user: '',
        password: '',
    }); 
    const SendDates = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(datesValue)
            });
            if(response.status == 200){
                const
            }
        }catch{

        }
    }
    return(
        <div className="Main-login-container">
            <div className='Form-login-container'>
                <form className='Form-login'>
                    <div className='Title-container'>
                        <h1 className='Title-text'>Vote Manager</h1>
                    </div>
                    <div className='Cc-container'>
                        <input className='Input-cc' type='number' placeholder='Documento de identificacion'></input>
                    </div>
                    <div className='Password-container'>
                        <input className='Input-Password' placeholder='Contraseña' type={visibilityState ? 'text' : 'password'}></input>
                        <img className='Visibility-icon' src={visibilityState ? ViewOff : View} onClick={() => {
                            setVisibilityState(!visibilityState);
                        }}></img>
                    </div>
                    <div className='Button-container'>
                        <button className='Button-sigin'>Ingresar</button>
                    </div>
                    <div className='Create-content'>
                        <span>¿Aun no te has registrado?</span>
                        <span className='Sing-up'>Registrarse</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;