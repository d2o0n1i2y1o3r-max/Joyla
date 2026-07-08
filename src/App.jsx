import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AuthGate from './components/AuthGate';
import './i18n';

function App() {
  return (
    <Router>
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </AuthGate>
    </Router>
  );
}

export default App;
