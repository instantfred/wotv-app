import React from "react";
import "../styles/App.css";

class GachaLog extends React.Component {
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

  countUrItems = (items) => {
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
    var urCounters = this.countUrItems(urItemsData);

    return (
      <div className="gacha-log">
        <div className="lucky-pulls">
          Lucky Pulls: {urItemsData.length}
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
      </div>
    );
  }
}

export default GachaLog;
