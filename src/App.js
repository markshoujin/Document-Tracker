import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Add from './pages/Add';
import Search from './pages/Search';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Logout from './pages/Logout';
import View from './pages/View';
import Generate from './pages/Generate';
import ViewTransaction from './pages/ViewTransaction';
import Receive from './pages/Receive';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Sidebar>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/add-document" element={<Add />} />
                  <Route path="/search-document" element={<Search />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/view" element={<View />} />
                  <Route path="/generate" element={<Generate />} />
                  <Route path="/view-receive" element={<Receive />} />
                  <Route path="/view-transaction" element={<ViewTransaction />} />
                </Routes>
              </Sidebar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
