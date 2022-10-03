import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import kycPage from "./pages/KycPage";
import BuyTokens from "./pages/BuyTokens";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    kycAddress: "",
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
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
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

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods
      .setKycCompleted(this.state.kycAddress)
      .send({ from: this.accounts[0] });
    alert("KYC for " + this.state.kycAddress + " is completed");
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="Navbar">
          <div className="title">Zollar Token</div>
          <div className="links">KYC-Whitelisting</div>
          <div className="links">Buy-Token</div>
        </div>
        <div className="initial">
          <h1>Asset Tokenization</h1>
          <p>
            Converting Ether (ETH) into ERC20 standard tokens, named Zollar
            (ZLR)
          </p>
        </div>
        <div className="kyc">
          <h2>Kyc Whitelisting</h2>
          <p>Address to allow: </p>
          <Input
            type="text"
            placeholder="Address"
            name="kycAddress"
            sx={{ margin: "5px", width: "30%" }}
            value={this.state.kycAddress}
            onChange={this.handleInputChange}
            required
          />
          <Button
            variant="contained"
            sx={{ margin: "5px" }}
            size="medium"
            onClick={this.handleKycWhitelisting}
          >
            Add to Whitelist
          </Button>
        </div>
        <div className="token">
          <h2>Buy Tokens</h2>
          <p>
            If you want to buy tokens, send Wei to this address: <br />
            <code>{this.state.tokenSaleAddress}</code>
          </p>
          <p>You currently have: {this.state.userTokens} Zollar(ZLR) Tokens</p>
          <Button variant="contained" onClick={this.handleBuyTokens}>
            Buy tokens
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
