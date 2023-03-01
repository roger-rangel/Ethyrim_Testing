import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xbAED786772496eca370e093BA854E8f041BF367A", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "The First Ethyrian",
        description: "This NFT will give you access to Ethyrim",
        image: readFileSync("scripts/assets/ethyrim.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();