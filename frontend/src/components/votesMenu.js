import Date from '../components/date'
import Vote from '../assets/icons/vote.svg'
import {useNavigate} from 'react-router-dom';

function VotesMenu() {
    const navigate = useNavigate();
    return (
        <div className="Container-menu">
            <div className="Vote-menu">
                <img className="Vote-icon" src={Vote} alt='Icon'></img>
                <button className="Button-menu" onClick={ () =>
                    navigate('/votesystem/votemenu')
                }><Date></Date></button>
            </div>
        </div>
    );
}
export default VotesMenu;