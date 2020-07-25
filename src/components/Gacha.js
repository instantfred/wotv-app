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
    this.addVisiore(200);
    var partialResult = this.buildSpec(unitCardWeights.data)();
    var result = this.gachaItemPicker(
      gachaItems[partialResult],
      partialResult
    )();
    // Send the UR items to the parent
    if (partialResult.includes("ur")) {
      this.props.gachaParentCallBack([{ id: result, type: partialResult }]);
    }
    this.setState({
      summonResult: [{ id: result, type: partialResult }],
    });
  };

  multiSummon = (event) => {
    event.preventDefault();
    var results = [];
    var itemsToPick = [];
    this.addVisiore(2000);
    // Generate the rarity and type of item to summon
    for (var i = 0; i < 10; i++) {
      var rarityAndType = this.buildSpec(unitCardWeights.data)();
      itemsToPick.push(rarityAndType);
    }
    itemsToPick = this.guaranteedMrPlus(itemsToPick);
    itemsToPick.forEach((item) => {
      results.push({
        id: this.gachaItemPicker(gachaItems[item], item)(),
        type: item,
      });
    });

    // Send the UR items to the parent
    this.props.gachaParentCallBack(
      results.filter((result) => result.type.includes("ur"))
    );

    this.setState({ summonResult: results });
  };

  // Checks for any mr/ur. If none then adds one mr+ item.
  guaranteedMrPlus = (itemsToPick) => {
    const rareItemIds = ["ur_unit", "ur_card", "mr_unit", "mr_card"];
    if (rareItemIds.some((item) => itemsToPick.includes(item))) {
    } else {
      console.log("Rolling extra guaranteed Mr+ item.");
      itemsToPick.splice(-1, 1);
      var guaranteedItem = this.buildSpec([
        { key: "ur_unit", weight: 2 },
        { key: "ur_card", weight: 2 },
        { key: "mr_unit", weight: 46 },
        { key: "mr_card", weight: 46 },
      ])();
      itemsToPick.push(guaranteedItem);
    }
    return itemsToPick;
  };

  addVisiore = (value) => {
    this.setState({ totalVisiore: this.state.totalVisiore + value });
    this.setState({ showResults: true });
  };

  gachaItemPicker = (possibleItems, type) => {
    var spec = {};
    var bannerPool = [];
    var basePercentage = 1 / possibleItems.length;
    var lastPoolKey = 1000;
    var featuredItemsByType = this.state.selectedBanner.gacha_items.filter(
      (item) => type.includes(item.type)
    );

    // Filter out every item from future banners
    lastPoolKey = type.includes("unit")
      ? this.state.selectedBanner.last_unit_key
      : this.state.selectedBanner.last_card_key;
    possibleItems = possibleItems.filter((item) => item.key <= lastPoolKey);
    // Filter out every limited item, except if the banner is limited
    bannerPool = possibleItems.filter((item) => item.limited === false);
    if (this.state.selectedBanner.limited) {
      if (type.includes("ur")) {
        var limitedItems = featuredItemsByType.filter((item) => item.limited);
        if (limitedItems.length > 0) {
          bannerPool.push(limitedItems[0]);
        }
      }
    }
    // This means an item is featured, the key is found in the current banner
    var includesFeaturedItem = this.state.selectedBanner.gacha_items.some(
      (featuredItem) => bannerPool.map((a) => a.key).includes(featuredItem.key)
    );
    if (includesFeaturedItem) {
      // Since an item is featured it gets a 25% boost and the remaining items top at 75%
      basePercentage = 0.75 / bannerPool.length;
    } else {
      basePercentage = 1 / bannerPool.length;
    }
    bannerPool.forEach((item, index) => {
      if (
        // This means the current item is featured
        featuredItemsByType.some((gi) => gi.key === item.key)
      ) {
        if (item.key === 62 && type.includes("unit")) {
          // custom case for Salire
          spec[`${item.key}`] = 0.1;
        } else {
          spec[`${item.key}`] = 0.25;
        }
      } else {
        // No featured item banner
        spec[`${item.key}`] = parseFloat(basePercentage.toFixed(3));
      }
    });

    return this.weightedRand(spec);
  };

  // It requires key and weight properties loaded in data
  // Will work for weighting rarity and type, then which item is selected.
  buildSpec = (data) => {
    var spec = {};
    data.forEach((item) => {
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
    this.setState({ luckyPulls: [] });
    this.props.gachaParentCallBack(null);
  };

  render() {
    let featuredItems;
    if (this.state.selectedBanner) {
      featuredItems = this.state.selectedBanner.gacha_items;
    }

    return (
      <div className="gacha-container">
        <form>
          <div className="banner-img">
            <img
              src={
                this.state.selectedBanner.image_path ||
                banners[banners.data[0].value].image_path
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
            {featuredItems && (
              <div className="featured-title">
                <p>Featured Units / Vision Cards</p>
              </div>
            )}
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
              <span>
                <input
                  type="button"
                  className="summon-btn"
                  onClick={this.singleSummon}
                  value="Summon x1"
                />
                <input
                  type="button"
                  className="summon-btn"
                  onClick={this.multiSummon}
                  value="Summon x10"
                />
              </span>
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
            {this.state.summonResult.map((result, index) => (
              <img
                key={index}
                className={`summon-item ${result.type}`}
                alt="result"
                src={this.getImagePath(result.type, result.id)}
              />
            ))}
          </div>
        )}
        {featuredItems && (
          <div>
            Total Spent:{" "}
            <img
              className="visiore-small"
              src="img/misc/visiore_s.png"
              alt="Visiore"
            />{" "}
            {this.state.totalVisiore}
          </div>
        )}
      </div>
    );
  }
}

export default Gacha;
