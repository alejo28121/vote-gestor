import President from '../assets/icons/president.svg'
import Senado from '../assets/icons/senado.svg'
import {useNavigate} from 'react-router-dom';

function VotesMenuTwo() {
    const navigate = useNavigate();
    return (
        <div className="Container-menu">
            <div className="Vote-menu">
                <img className="Vote-icon" src={President}></img>
                <button className="Button-menu" onClick={() => 
                    navigate('/votesystem/president')
                }>Consulta Presidencia</button>
            </div>
            <div className="Vote-menu">
                <img className="Vote-icon" src={Senado}></img>
                <button className="Button-menu">Consulta Senado</button>
            </div>
        </div>
    );
}
export default VotesMenuTwo;