import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import {ethers, Contract} from "ethers"


function App() {
  const initialState = { accounts: [], balance: "" };
  const [wallet, setWallet] = useState(initialState);
  const [hasProvider, setHasProvider] = useState(null);
  const [contractBalance, setContractBalance] = useState();
  const [contract, setContract] = useState();
  const [greet, setGreet] = useState("bew")
  const [contractInitialised, setContractInitialised] = useState(false)

  let provider;
  let signer;

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "greet",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      name: "setGreeting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // const updateContractBalance = async (contractAddress) => {
  //   const balanceResponse = await window.ethereum.request({
  //     method: "eth_getBalance",
  //     params: [contractAddress, "latest"],
  //   });

  //   setContractBalance(formatBalance(balanceResponse));
  // };





  useEffect(() => {
    const getProvider = async () => {
      // provider = await detectEthereumProvider({ silent: true });
      // provider = ethers.getDefaultProvider()
      // console.log("signer", signer)
      // setHasProvider(Boolean(provider));
      // console.log(provider);

      provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    };
    getProvider();

    const getConnection = async () => {
      console.log("in this function");
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const balance = await provider.getBalance(contractAddress)
      // console.log("balance", format)
      setContractBalance(ethers.formatEther(balance));
    };

    getConnection()
  

    const getContract = async () => {
      signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      setContract(contract)
      setContractInitialised(true)

      contract.greet().then((greeting) => {
        setGreet(greeting)
        console.log("Current greeting:", greeting);
      });


      // const greetResponse = await contract.greet()
      // console.log("greetest", greettest)


      





      console.log("MY CONTRACT", contract)
      
      // const greeting = await contract.greet();
      // console.log("greeting", greeting)
      // setGreet(greeting);
    };

    getContract()

    // const handleConnect = async () => {
    //   const accounts = await window.ethereum.request({  method: "eth_requestAccounts" })
    //   setWallet({accounts})

    // }
    // handleConnect()

    // const getBalance = async() => {
    //   const balance = await provider.getBalance("x5FbDB2315678afecb367f032d93F642f64180aa3")
    //   setGreet(ethers.utils.formatEther(balance))
    // }

    // getBalance()
  }, []);

  // const updateWallet = async (accounts) => {
  //   setWallet({ accounts });
  //   // const balanceResponse = await window.ethereum.request({
  //   //   method: "eth_getBalance",
  //   //   params: [accounts[0], "latest"],
  //   // });

  //   // console.log("balance responsw",balanceResponse)

  //   // setWallet({accounts, balanceResponse})
  //   // setBalance(balanceResponse)
  // };

  // const updateWallet = async (accounts) => {
  //   const balanceResponse = await window.ethereum.request({
  //     method: "eth_getBalance",
  //     params: [accounts[0], "latest"],
  //   });

  //   const balance = formatBalance(balanceResponse);
  //   setWallet({ accounts, balance });
  //   console.log("wallet", { accounts, balance }); /* Updated */
  // };


  // const updateBalance = async (account) => {
  //   console.log("account", account)
  //   const provider = await detectEthereumProvider({ silent: true });
  //   const balance = await provider.getBalance(account)

  // }

  // const handleConnect = async () => {
  //   console.log("in this function");
  //   let accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   updateWallet(accounts);
  //   updateContractBalance(contractAddress);
  // };

  const handleDepositSubmit = async (e) => {
    e.preventDefault()
    const depositValue = e.target[0].value;
    console.log("Deposit value:", depositValue);

    const ethValue = ethers.parseEther(depositValue)
    console.log("ethvalue", ethValue)
    const res = await contract.deposit({value: ethValue});
    await res.wait()
    provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(contractAddress);
    setContractBalance(ethers.formatEther(balance));
  };

  const handleChangeSubmit = async (e) => {
    e.preventDefault()

    const changeValue = e.target[0].value;
    console.log("Change value:", changeValue);
    console.log("my contract in the function", contract)

    const res = await contract.setGreeting(changeValue)
    await res.wait();
    setGreet(changeValue)
  };

  return (
    <div className="container">
  
  <div className="container">
  {contract ? (
    <div className="row mt-5">
      <div className="col">
        <h3>{greet}</h3>
        <p>Contract balance is {contractBalance} ETH</p>
      </div>
      <div className="col">
        <form onSubmit={handleDepositSubmit}>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              defaultValue="0"
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Deposit
          </button>
        </form>{" "}
        <form className="mt-5" onSubmit={handleChangeSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              defaultValue="sample greeting"
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Change
          </button>
        </form>{" "}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )}
</div>
    </div>
  );
}

export default App;
