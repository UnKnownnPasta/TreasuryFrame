import React, { useState } from 'react'
import './App.css'
import Homebar from './components/homebar/Homebar'
import Sidebar from './components/sidebar/Sidebar';

const App: React.FC = () => {
  const [expanded, setExpansion] = useState(false);

  return (
    <div className="container">
      <Homebar expanded={expanded} setExpansion={setExpansion} />
      <Sidebar expanded={expanded} />
    </div>
  );
};

export default App;
