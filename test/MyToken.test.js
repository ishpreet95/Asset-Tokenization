const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("Token Test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.mytoken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it("all tokens should be in my account", async () => {
    let instance = this.mytoken;
    let totalSupply = await instance.totalSupply();
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.eq(totalSupply);
  });

  it("is possible to send tokens between accounts", async () => {
    const sendTokens = 1;
    let instance = this.mytoken;
    let totalSupply = await instance.totalSupply();
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.eq(
      totalSupply
    );
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.eq(
      totalSupply.sub(new BN(Number(sendTokens)))
    );
    return expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.eq(new BN(Number(sendTokens)));
  });

  it("is not possible to send more tokens than available in total", async () => {
    let instance = this.mytoken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);

    expect(instance.transfer(recipient, new BN(Number(balanceOfDeployer + 1))))
      .to.eventually.be.rejected;

    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.eq(balanceOfDeployer);
  });
});
