import React from "react";
import "../styles/App.css";
import Gacha from "./Gacha";
//import UpdatesLog from "./UpdatesLog";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-title">Summon Simulator</div>
        </nav>
        <Gacha />
      </div>
    );
  }
}

export default App;
