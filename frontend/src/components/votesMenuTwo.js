import President from '../assets/icons/president.svg'
import Senado from '../assets/icons/senado.svg'
import Admin from '../assets/icons/admin.svg'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function VotesMenuTwo() {
    const info = JSON.parse(localStorage.getItem('info'));
    const navigate = useNavigate();
    const [rolValue] = useState(info.rol);
    return (
        <div className="Container-menu">
            <div className="Vote-menu">
                <img className="Vote-icon" src={President} alt='Icon'></img>
                <button className="Button-menu" onClick={() => 
                    navigate('/votesystem/president')
                }>Consulta Presidencia</button>
            </div>
            <div className="Vote-menu">
                <img className="Vote-icon" src={Senado} alt='Icon'></img>
                <button className="Button-menu">Consulta Senado</button>
            </div>
            {rolValue === "1" ? (
                <div className="Vote-menu">
                    <img className="Vote-icon" src={Admin} alt='Icon'></img>
                    <button className="Button-menu" onClick={() => 
                    navigate('/votesystem/dashboard')
                }>Administrar</button>
                </div>
            ) : ('')}
        </div>
    );
}
export default VotesMenuTwo;