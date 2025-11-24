import './App.css';
import Login from './pages/login'
import Register from './components/register';
import VotePage from './pages/vote'
import VotesMenu from './components/votesMenu'
import VotesMenuTwo from './components/votesMenuTwo'
import President from './components/president'
import Dashboard from './components/admin'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/votesystem/' element={<VotePage/>}>
              <Route path='principalmenu' element={<VotesMenu/>}/>
              <Route path='votemenu' element={<VotesMenuTwo/>}/>
              <Route path='president' element={<President/>}/>
              <Route path='dashboard' element={<Dashboard/>}/>
            </Route>
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
