import React, { Component } from "react";
import KycContract from "../contracts/KycContract.json";
import getWeb3 from "../getWeb3";

class KycPage extends Component {
  state = {
    loaded: false,
    kycAddress: "",
  };
  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.networkId = await this.web3.eth.net.getId();
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
      );
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
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
      <div>
        <h2>Kyc Whitelisting</h2>
        Address to allow:
        <input
          type="text"
          name="kycAddress"
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycWhitelisting}>
          Add to Whitelist
        </button>
      </div>
    );
  }
}
export default KycPage;
