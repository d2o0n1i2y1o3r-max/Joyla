import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Dachas from './pages/Dachas';
import Family from './pages/Family';
import About from './pages/About';
import AuthGate from './components/AuthGate';
import PageSwitcherFab from './components/PageSwitcherFab';
import './i18n';

function App() {
  return (
    <Router>
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dachas" element={<Dachas />} />
          <Route path="/family" element={<Family />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <PageSwitcherFab />
      </AuthGate>
    </Router>
  );
}

export default App;
