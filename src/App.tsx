import React from 'react';
import ConnectToPhantom from './components/ConnectToPhantom/ConnectToPhantom';




function App() {
  
  React.useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
  console.log(process)
  return (
    <div className="app-container">
      <ConnectToPhantom />
    </div>
  );
}

export default App;
