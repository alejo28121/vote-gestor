import logo from './logo.svg';
import './App.css';
import Login from './pages/login'
import VotePage from './pages/vote'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/votesystem' element={<VotePage/>}/>
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
