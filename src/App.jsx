/* eslint-disable no-unused-vars */
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance, useNetwork } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { ChainId } from "@thirdweb-dev/sdk";
import { TwitterShareButton, TwitterIcon } from 'react-share';
import mixpanel from "mixpanel-browser";

console.log(process.env.MIXPANEL, 'MIXPANEL')
console.log(process.env.ALCHEMY_API_URL)
console.log('App loaded')
// mixpanel.init(process.env.MIXPANEL);
// mixpanel.track("Website Visited");

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);
  const network = useNetwork();

  // Initialize our Edition Drop contract
  const editionDropAddress = "0xbAED786772496eca370e093BA854E8f041BF367A";
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Ethyrim</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (address && network?.[0].data.chain.id !== ChainId.Mumbai) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Polygon</h2>
        <p>
          This dapp only works on the Polygon network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

  // Add this little piece!
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>03/23/23</h1>
        <h2>New Worlds Await</h2>
        <div className='btn-socials'>
          <TwitterShareButton url={'https://gateway.ipfscdn.io/ipfs/QmSg7MQw4Lk9qvMVFe1xwmEGr2Q7tTWqL8buDCC95NoGKL/0'}>
          <TwitterIcon size={52}/>
          </TwitterShareButton>
          <a href="https://twitter.com/Roger_RR_">Follow me here</a>
        </div>
      </div>
    );
  };

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <img className="img-mint" alt="ethyrim" src="/ethyrian.png" />
      <h1>Join Ethyrim</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
}

export default App;