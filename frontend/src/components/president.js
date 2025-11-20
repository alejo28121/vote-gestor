import Daniel from '../assets/images/Daniel.svg'
import Ivan from '../assets/images/Ivan.svg'
import Diana from '../assets/images/Diana.svg'
import { useState } from 'react';

function President(){
    const info = JSON.parse(localStorage.getItem('info'));
    const [select, setSelect] = useState(0);
    const [datesValue, setdatesValue] = useState({
        function : 'RegisVotes',
        candidate: '',
        user: info.user,
    }); 
    const SendDates = async () => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/regisvote`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(datesValue)
            });
            if(response.status == 200){
                const data = await response.json();
            }else{
                alert("Usuario ya ha votado antes");
            }
        }catch(error){
                console.error("error en la solicitud: ", error);
        }
    }
    return(
        <div className="Container-menu-p">
            <div className='presidents'>
                <div className={`Vote-menu-${select == 1 ? 's' : 'p'}`} onClick={(e) => {
                            setdatesValue({
                                ...datesValue,
                                candidate: 'DANIEL QUINTERO CALLE'
                            })
                            setSelect(1)
                        }
                    }>
                    <span className='Candidate-number'>Candidato #1</span>
                    <div className='Back-candidate'>
                        <img className='Img-candidate' src={Daniel}></img>
                    </div>
                    <span className='Candidate-name'>DANIEL QUINTERO CALLE</span>
                </div>
                <div className={`Vote-menu-${select == 2 ? 's' : 'p'}`} onClick={(e) => {
                            setdatesValue({
                                ...datesValue,
                                candidate: 'DIANA CAROLINA CORCHO MEJIA'
                            })
                            setSelect(2)
                        }
                    }>
                    <span className='Candidate-number'>Candidata #2</span>
                    <div className='Back-candidate'>
                        <img className='Img-candidate' src={Diana}></img>
                    </div>
                    <span className='Candidate-name'>DIANA CAROLINA CORCHO MEJIA</span>
                </div>
                <div className={`Vote-menu-${select == 3 ? 's' : 'p'}`} onClick={(e) => {
                            setdatesValue({
                                ...datesValue,
                                candidate: 'IVAN CEPEDA CASTRO'
                            })
                            setSelect(3)
                        }
                    }>
                    <span className='Candidate-number'>Candidato #3</span>
                    <div className='Back-candidate'>
                        <img className='Img-candidate' src={Ivan}></img>
                    </div>
                    <span className='Candidate-name'>IVAN CEPEDA CASTRO</span>
                </div>
            </div>
            <div className='Container-send-vote'>
                <button className='Button-send' onClick={() => { 
                    if(select != 0){
                        SendDates()
                    }
                }}>Votar</button>
            </div>
        </div>
    );
}
export default President;