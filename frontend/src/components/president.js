import Daniel from '../assets/images/Daniel.svg'
import Ivan from '../assets/images/Ivan.svg'
import Diana from '../assets/images/Diana.svg'
import Loading from './loading';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function President(){
    const info = JSON.parse(localStorage.getItem('info'));
    const [select, setSelect] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorValue, setErrorValue] = useState("");
    const navigate = useNavigate();
    const [datesValue, setdatesValue] = useState({
        function : 'RegisVotes',
        candidate: '',
        user: info.user,
    }); 
    const SendDates = async () => {
        const MIN_TIME = 2000; 
        const start = Date.now();
        try{
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/regisvote`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(datesValue)
            });
            if(response.status === 200){
                setSelect(0);
                setErrorValue("");
            }else{
                setErrorValue("Usuario ya ha votado antes");
            }
        }catch(error){
            setErrorValue("Error en la solicitud");
        }finally{
            const elapsed = Date.now() - start;
            const remaining = MIN_TIME - elapsed;
            if (remaining > 0) {
                setTimeout(() => 
                    setLoading(false),
                    remaining);
                navigate('/votesystem/votemenu')
            }else{
                setLoading(false);
            }
        }
    }
    return(
        <div className="Container-menu-p">
            {loading ? (
                <Loading></Loading>
                ) : (
                <div className='presidents'>
                    <div className={`Vote-menu-${select === 1 ? 's' : 'p'}`} onClick={(e) => {
                                setdatesValue({
                                    ...datesValue,
                                    candidate: 'DANIEL QUINTERO CALLE'
                                })
                                setSelect(1)
                            }
                        }>
                        <span className='Candidate-number'>Candidato #1</span>
                        <div className='Back-candidate'>
                            <img className='Img-candidate' src={Daniel} alt='Candidate'></img>
                        </div>
                        <span className='Candidate-name'>DANIEL QUINTERO CALLE</span>
                    </div>
                    <div className={`Vote-menu-${select === 2 ? 's' : 'p'}`} onClick={(e) => {
                                setdatesValue({
                                    ...datesValue,
                                    candidate: 'DIANA CAROLINA CORCHO MEJIA'
                                })
                                setSelect(2)
                            }
                        }>
                        <span className='Candidate-number'>Candidata #2</span>
                        <div className='Back-candidate'>
                            <img className='Img-candidate' src={Diana} alt='Candidate'></img>
                        </div>
                        <span className='Candidate-name'>DIANA CAROLINA CORCHO MEJIA</span>
                    </div>
                    <div className={`Vote-menu-${select === 3 ? 's' : 'p'}`} onClick={(e) => {
                                setdatesValue({
                                    ...datesValue,
                                    candidate: 'IVAN CEPEDA CASTRO'
                                })
                                setSelect(3)
                            }
                        }>
                        <span className='Candidate-number'>Candidato #3</span>
                        <div className='Back-candidate'>
                            <img className='Img-candidate' src={Ivan} alt='Candidate'></img>
                        </div>
                        <span className='Candidate-name'>IVAN CEPEDA CASTRO</span>
                    </div>
                </div>
                )}
            <div className='Container-send-vote'>
                <span className='Error'>{errorValue}</span>
                <button className='Button-send' onClick={() => { 
                    if(select !== 0){
                        SendDates()
                    }
                }}>Votar</button>
            </div>
        </div>
    );
}
export default President;