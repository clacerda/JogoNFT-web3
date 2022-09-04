/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import twitterLogo from "./assets/twitter-logo.svg";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants"
import myEpicGame from "./utils/MyEpicGame.json"
import { ethers } from "ethers";
import Arena from './Components/Arena';
import LoadingIndicator from "./Components/LoadingIndicator/index.jsx";

// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;



const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        setIsLoading(false);
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("Please connect to Goerli!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Métodos de renderização
  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://c.tenor.com/3MuX4AU08SMAAAAC/cthulhu-illithids.gif"
            alt="Ktulhu gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
        </div>
      );
      /*
       * cenário #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };


  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);


  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("Usuário tem um personagem NFT")
        setCharacterNFT(transformCharacterData(txn.name))
      } else {
        console.log("Nenhum personagem NFT foi encontrado")
      }

      /*
       * Uma vez que tivermos acabado a busca, configure o estado de carregamento para falso.
       */
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log("Conta Atual:", currentAccount)
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🐙 A batalha em R'lyeh 🐙</p>
          <p className="sub-text">Desafie o grande Ctulhu e evite seu despertar.</p>
          {/*
         * Aqui é onde nosso botão e código de imagem ficava! Lembre-se que movemos para o método de renderização.
         */}
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Dev - Claudio Vieira com apoio da: @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;