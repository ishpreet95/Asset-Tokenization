import React, { Component } from "react";
import MyToken from "../contracts/MyToken.json";
import MyTokenSale from "../contracts/MyTokenSale.json";
import getWeb3 from "../getWeb3";

class BuyTokens extends Component {
  state = {
    loaded: false,
    tokenSaleAddress: null,
    userTokens: 0,
  };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.networkId = await this.web3.eth.net.getId();
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] &&
          MyToken.networks[this.networkId].address
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] &&
          MyTokenSale.networks[this.networkId].address
      );
      this.listenToTokenTransfer();
      this.setState(
        {
          loaded: true,
          tokenSaleAddress: MyTokenSale.networks[this.networkId].address,
        },
        this.updateUserTokens
      );
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods
      .balanceOf(this.accounts[0])
      .call();
    this.setState({ userTokens: userTokens });
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events
      .Transfer({ to: this.accounts[0] })
      .on("data", this.updateUserTokens);
  };

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
      from: this.accounts[0],
      value: this.web3.utils.toWei("1", "wei"),
    });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Zollar Token Sale</h1>
        <p>Get your Tokens today!</p>
        <h2>Buy Tokens</h2>
        <p>
          If you want to buy tokens, send Wei to this address:{" "}
          {this.state.tokenSaleAddress}
        </p>
        <p>You currently have: {this.state.userTokens} Zollar(ZLR) Tokens</p>
        <button type="button" onClick={this.handleBuyTokens}>
          Buy more tokens
        </button>
      </div>
    );
  }
}

export default BuyTokens;
