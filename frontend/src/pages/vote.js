import '../assets/styles/vote.css'
import Logout from '../assets/icons/logout.svg'
import Clock from '../components/clock'
import { Outlet } from 'react-router-dom';

function VotePage(){
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
                <Clock></Clock>
                <span className='Date-span'></span>
            </div>
            <Outlet/>
            <div className='Container-logout'>
                <img className='Logout-icon' src={Logout}></img>
            </div>
        </div>
    );
}
export default VotePage;