import React from "react";
import "../styles/App.css";
import Gacha from "./Gacha";
import GachaLog from "./GachaLog";
//import UpdatesLog from "./UpdatesLog";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luckyPulls: [],
    };
  }

  gachaCallBack = (urItems) => {
    if (urItems === null) {
      this.setState({ luckyPulls: [] });
    } else {
      this.setState({ luckyPulls: urItems.concat(this.state.luckyPulls) });
    }
  };

  render() {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-title">Summon Simulator</div>
        </nav>
        <Gacha gachaParentCallBack={this.gachaCallBack} />
        <GachaLog urItems={this.state.luckyPulls} />
      </div>
    );
  }
}

export default App;
