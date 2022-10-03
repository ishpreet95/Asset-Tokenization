import React, { Component } from "react";
import KycPage from "./pages/KycPage";
import BuyTokens from "./pages/BuyTokens";

class Test extends Component {
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <KycPage />
        <BuyTokens />
      </div>
    );
  }
}

export default Test;
