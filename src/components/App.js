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
      pullResults: [],
    };
  }

  gachaCallBack = (urItems) => {
    if (urItems === null) {
      this.setState({ luckyPulls: [] });
    } else {
      this.setState({ luckyPulls: urItems.concat(this.state.luckyPulls) });
    }
  };

  gachaPullResultsCallBack = (results) => {
    if (results === null) {
      this.setState({ pullResults: [] });
    } else {
      this.setState({
        pullResults: results.concat(this.state.pullResults),
      });
    }
  };

  render() {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-title">WotV Summon Simulator</div>
          <div className="donation">
            <a
              href="https://ko-fi.com/F1F51J6VY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="kofi-img"
                src="https://cdn.ko-fi.com/cdn/kofi1.png?v=2"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </div>
        </nav>
        <Gacha
          gachaParentCallBack={this.gachaCallBack}
          gachaPullResultsCallBack={this.gachaPullResultsCallBack}
        />
        <GachaLog
          urItems={this.state.luckyPulls}
          pullResults={this.state.pullResults}
        />
      </div>
    );
  }
}

export default App;
