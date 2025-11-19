import '../assets/styles/vote.css'
import Logout from '../assets/icons/logout.svg'
import Vote from '../assets/icons/vote.svg'

function VotePage(){
    const now = new Date();
    return(
        <div className="Main-container-votes">
            <div className='Container-title'>
                <h1 className='Title'>Vote System</h1>
            </div>
            <div className='Container-subtitle'>
                <div className='Subtitle-box'>
                    <h2 className='Subtitle-text'>Consulta de partidos 2025</h2>
                </div>
            </div>
            <div className='Container-time'>
                <span className='Time-span'>{now.toLocaleString()}</span>
                <span className='Date-span'></span>
            </div>
            <div className='Container-menu'>
                <div className='Vote-menu'>
                    <img className='Vote-icon' src={Vote}></img>
                    <button className='Button-menu'></button>
                </div>
            </div>
            <div className='Container-logout'>
                <img className='Logout-icon' src={Logout}></img>
            </div>
        </div>
    );
}
export default VotePage;