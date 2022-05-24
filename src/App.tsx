import ConnectToPhantom from './components/ConnectToPhantom/ConnectToPhantom';
import "./App.css";
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <ConnectToPhantom />
    </div>
  );
}

export default App;
