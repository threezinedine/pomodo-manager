import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Pomodoro Manager</div>} />
      </Routes>
      {/* ToastContainer — always mounted once, handles its own visibility */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
