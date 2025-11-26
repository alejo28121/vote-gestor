import President from '../assets/icons/president.svg'
import Senado from '../assets/icons/senado.svg'
import Admin from '../assets/icons/admin.svg'
import Camara from '../assets/icons/camara.svg'
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
                    navigate('/votesystem/president', { state: { mode: 1 } })
                }>Consulta Presidencia</button>
            </div>
            <div className="Vote-menu">
                <img className="Vote-icon" src={Senado} alt='Icon'></img>
                <button className="Button-menu" onClick={() => 
                    navigate('/votesystem/senado', { state: { mode: 2 } })
                }>Consulta Senado</button>
            </div>
            <div className="Vote-menu">
                <img className="Vote-icon" src={Camara} alt='Icon'></img>
                <button className="Button-menu" onClick={() => 
                    navigate('/votesystem/camara', { state: { mode: 3 } })
                }>Consulta Camara</button>
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