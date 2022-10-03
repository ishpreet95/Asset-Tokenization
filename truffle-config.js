const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({ path: "./.env" });
const AccountIndex = 0;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777,
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "http://127.0.0.1:7545",
          AccountIndex
        );
      },
      network_id: 5777,
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://ropsten.infura.io/v3/5c5579adb87541a3af9a162b778fc890",
          AccountIndex
        );
      },
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",
    },
  },
};
