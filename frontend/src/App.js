import AuthPage from './components/authPage/AuthPage';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Tasks from './components/task/Tasks';


function App() {
  
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={ <AuthPage />} />
        <Route path="/task" element={ <Tasks />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
