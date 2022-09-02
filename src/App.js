import "./App.css";
import { ethers } from "ethers"; // This is to use Metamask as a provider
import { useState, useEffect } from "react";
import { GiVoodooDoll } from "react-icons/gi";
import { BiAnchor } from "react-icons/bi";
import abi from "./abi/abi2.json";
import data from "./data/data2.json";

function App() {
  const [account, setAccount] = useState(""); //variable created to store the metamask account data
  const [provider, setProvider] = useState(null); //variable to store the provider
  const [nfts, setNFTs] = useState(data);

  const balance = async (nft) => {
    const contract = new ethers.Contract(nft.address, abi, provider); //Create a contract instance to query/read the balance and return the results.
    const tempBalance = await contract.balanceOf(account); //await is used because the function is asyncronous
    const tempNfts = [...nfts.list]; //temporary variable that stores the data of all the nfts from the data.json the 3 dots indicates a copy
    const tempNft = tempNfts[tempNfts.findIndex((obj) => obj.id == nft.id)]; //This function extracts the exact nft we want to use
    tempNft.owner = tempBalance > 0;
    tempNft.count = tempBalance.toString();
    setNFTs({
      list: tempNfts,
    });
  };

  const checkCollection = () => {
    data.list.forEach((nft) => {
      balance(nft);
      console.log(nft);
    });
  };

  //fuction that checks if metamask is installed and if so stores account info after connecting
  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      //If the window of the browser has metamask
      //Get Metamask Accounts. Asking the Metamask provider a request of all the accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //Request a provider in case I need to create a contract
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
      setAccount(accounts[0]); //This saves the accounts data requested into the account variable
    } else {
      //if not it will ask you to install metamask
    }
  };

  //This ensures that the wallet stays connected if the site is refreshed
  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    checkCollection();
  }, [account]); //calls this function every time the account variable changes

  // LAYOUT
  return (
    <div className="page">
      <div className="app--header">
        {/* use require to add images into img tags without importing the file */}
        <img src={require("./assets/images/logo.jpg")} className="app--logo" />
        <p>
          <span>
            <GiVoodooDoll style={{ marginRight: "10px" }} />
          </span>
          Mr. Doll
        </p>

        {/* If the account is connected then hide the button and 
        show the address if not then show the connect button */}
        {account == "" ? (
          <button onClick={initConnection} className="app--btnWallet">
            Connect
          </button>
        ) : (
          <p>...{account.substring(account.length - 7)}</p>
        )}
      </div>
      <div className="app--main">
        {nfts.list.map((nft, index) => {
          return (
            <div key={index} className="nft--card">
              <div style={{ position: "relative" }}>
                <a
                  target={"_blank"}
                  href={`https://opensea.io/assets/ethereum/0x1A47Ca25124b4d8cd9c7c825aA64cC7F07629529/${nft.link}`}
                >
                  <BiAnchor className="nft--cardImage" />
                </a>
                <GiVoodooDoll
                  className="nft--cardImage"
                  style={{ opacity: nft.owner ? 1 : 0.2 }}
                />
                <p className="nft--counter">{nft.count}</p>
              </div>
              <img
                src={require(`./assets/images/${nft.id}.${nft.type}`)}
                className="nft--img"
                style={{ opacity: nft.owner ? 1 : 0.2 }}
              />
              <p className="nft--title">{nft.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
