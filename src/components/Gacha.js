import React from "react";
import Select from "react-select";
import "../styles/App.css";
import banners from "../data/Banners.json";
import unitCardWeights from "../data/UnitCardWeights.json";
import gachaItems from "../data/GachaItems.json";

class Gacha extends React.Component {
  state = {
    enableSummon: false,
    selectedBanner: {},
    showResults: false,
    summonResult: {},
    totalVisiore: 0,
  };

  handleBannerChange = (event) => {
    this.setState({ selectedBanner: banners[event.value] });
    this.setState({ enableSummon: true });
  };

  singleSummon = (event) => {
    event.preventDefault();
    this.setState({ totalVisiore: this.state.totalVisiore + 200 });
    this.setState({ showResults: true });
    var partialResult = this.buildSpec(unitCardWeights.data)();
    var result = this.gachaItemPicker(gachaItems[partialResult])();
    this.setState({ summonResult: { id: result, type: partialResult } });
  };

  gachaItemPicker = (possibleItems) => {
    var spec = {};
    var nonLimitedItems = [];
    var basePercentage = 1 / possibleItems.length;

    if (this.state.selectedBanner.limited) {
      // TODO: Logica para banners con unidades limitadas, como Ramza & Orlandeau
      console.log("madre mia es un banner limitado");
    } else {
      // Filter out every non limited item and loop over them
      nonLimitedItems = possibleItems.filter((item) => item.limited === false);
      nonLimitedItems.map((item, index) => {
        if (
          this.state.selectedBanner.gacha_items.some(
            (gi) => gi.key === item.key
          )
        ) {
          // This means the current item is featured, the key is found in the current banner
          spec[`${item.key}`] = (basePercentage * 1.25).toFixed(3);
        } else {
          // No featured item banner
          spec[`${item.key}`] = basePercentage.toFixed(3);
        }
      });
    }
    return this.weightedRand(spec);
  };

  // It requires key and weight properties loaded in data
  // Will work for weighting rarity and type, then which item is selected
  buildSpec = (data) => {
    var spec = {};
    data.map((item) => {
      spec[`${item.key}`] = item.weight;
    });
    return this.weightedRand(spec);
  };

  weightedRand = (spec) => {
    // baseDecimalValue should be computed based on the weights in the spec.
    // E.g. the spec {0:0.999, 1:0.001} will break if 10 is the base. 100 would be needed.
    const baseDecimalValue = 100;
    var i,
      j,
      table = [];
    for (i in spec) {
      for (j = 0; j < spec[i] * baseDecimalValue; j++) {
        table.push(i);
      }
    }
    return function () {
      return table[Math.floor(Math.random() * table.length)];
    };
  };

  getImagePath = (type, name) => {
    if (type.indexOf("unit") !== -1) {
      return `img/unit_portrait/${name}.jpg`;
    } else {
      return `img/vision_card/${name}.jpg`;
    }
  };

  resetSummons = (event) => {
    event.preventDefault();
    this.setState({ totalVisiore: 0 });
    this.setState({ showResults: false });
  };

  render() {
    let featuredItems;
    if (this.state.selectedBanner) {
      featuredItems = this.state.selectedBanner.featured_items;
    }

    return (
      <div className="gacha-container">
        <form>
          <div className="banner-img">
            <img
              src={
                this.state.selectedBanner.image_path ||
                "/img/banners/miranda_dorando.jpg"
              }
              alt="Pull Banner"
            />
          </div>
          <div>
            <Select
              options={banners.data}
              onChange={(event) => this.handleBannerChange(event)}
            />
          </div>
          <div className="featured-items">
            <h4>Featured Unit / Vision Cards</h4>
            {featuredItems &&
              featuredItems.map((item) => {
                return (
                  <img
                    src={this.getImagePath(item.type, item.key)}
                    alt="icon"
                    className="featured-item"
                    key={`${item.key}_${item.type}`}
                  />
                );
              })}
          </div>
          <div className="summon-buttons">
            {this.state.enableSummon && (
              <input
                type="button"
                className="summon-btn"
                onClick={this.singleSummon}
                value="Summon x1"
              />
            )}
            {this.state.totalVisiore > 0 && (
              <input
                type="button"
                className="reset-btn"
                onClick={this.resetSummons}
                value="Reset"
              />
            )}
          </div>
        </form>
        {this.state.showResults && (
          <div className="summon-results">
            <div>
              <img
                className="summon-item"
                alt="result"
                src={this.getImagePath(
                  this.state.summonResult.type,
                  this.state.summonResult.id
                )}
              />
            </div>
          </div>
        )}
        <div>
          Total Spent:{" "}
          <img
            className="visiore-small"
            src="img/misc/visiore_s.png"
            alt="Visiore"
          />{" "}
          {this.state.totalVisiore}
        </div>
      </div>
    );
  }
}

export default Gacha;
