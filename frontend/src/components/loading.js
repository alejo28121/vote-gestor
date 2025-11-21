import '../assets/styles/loading.css'

function Loading(){
    return(
        <div className='Main-loading'>
            <div className='Loading-content'>
                <div class="loader">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    );
}
export default Loading;