import React from "react";
import "../styles/App.css";

class GachaLog extends React.Component {
  state = {
    displayStats: false,
  };

  handleStatsIconClick = (event) => {
    var value = this.state.displayStats === false;
    this.setState({ displayStats: value });
  };

  getUrItemsData = () => {
    var partialResults = [];

    this.props.urItems.forEach((element) => {
      partialResults.push({
        key: `${element.id}_${element.type}`,
        id: element.id,
        type: element.type,
      });
    });
    return partialResults;
  };

  getItemsData = () => {
    var partialResults = [];

    this.props.pullResults.forEach((element) => {
      partialResults.push({
        key: `${element.id}_${element.type}`,
        id: element.id,
        type: element.type,
      });
    });
    return partialResults;
  };

  countItems = (items) => {
    var counter = {};

    items.forEach(function (element) {
      counter[element.key] = (counter[element.key] || 0) + 1;
    });
    // returns an array so that I can loop over the results
    return Object.keys(counter).map((i) => ({
      key: i,
      quantity: counter[i],
    }));
  };

  // converts arrays to objects. keyField is the property we want to use as key
  arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});

  // This is the exact same function as in Gacha.js, might as well move it to a helper file
  getImagePath = (type, name) => {
    if (type.indexOf("unit") !== -1) {
      return `img/unit_portrait/${name}.jpg`;
    } else {
      return `img/vision_card/${name}.jpg`;
    }
  };

  render() {
    var urItemsData = this.getUrItemsData();
    var urItemObjects = this.arrayToObject(urItemsData, "key");
    var urCounters = this.countItems(urItemsData);

    var resultsData = this.getItemsData();
    var resultsObjects = this.arrayToObject(resultsData, "key");
    var resultsCounters = this.countItems(resultsData);
    resultsCounters.sort((a, b) => (a.quantity < b.quantity ? 1 : -1));

    return (
      <div className="gacha-log">
        <div className="lucky-pulls">
          Lucky Pulls: {urItemsData.length}
          <img
            className="stats-icon"
            alt="Statistics"
            src="img/misc/graph.png"
            onClick={(event) => this.handleStatsIconClick(event)}
          />
          <div className="items-container">
            {urCounters.map((item, index) => (
              <div className="ur-container" key={`${item.key}_${index}`}>
                <img
                  key={index}
                  className="lucky-pull"
                  alt="UR"
                  src={this.getImagePath(
                    urItemObjects[item.key].type,
                    urItemObjects[item.key].id
                  )}
                />
                <div
                  key={`${index}_${item.quantity}`}
                  className="item-quantity"
                >
                  {item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        {this.state.displayStats && (
          <div className="pullResults">
            <h2>Full Log & Appearance Rates</h2>
            Total items: <strong>{resultsData.length}</strong>
            <div className="stats-container">
              {resultsCounters.map((item, index) => (
                <div className="stats-data" key={`${item.key}_${index}`}>
                  <img
                    key={index}
                    className={`stats-image ${resultsObjects[item.key].type}`}
                    alt=""
                    src={this.getImagePath(
                      resultsObjects[item.key].type,
                      resultsObjects[item.key].id
                    )}
                  />
                  <div
                    key={`${index}_${item.quantity}`}
                    className="stats-quantity"
                  >
                    {item.quantity}
                  </div>
                  <div className="stats-percentage">{`${(
                    (item.quantity / resultsData.length) *
                    100
                  ).toLocaleString("en-US", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 0,
                  })}%`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default GachaLog;
