// import { nftStorage } from "@metaplex-foundation/umi-uploader-nft-storage";
// import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";
import { generateSigner, createUmi } from "@metaplex-foundation/umi";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// const wallet = useWallet();
// const { connection } = useConnection();
// const umi = createUmi(connection).use(walletAdapterIdentity(wallet));

export const nftUpload = async (imageFile) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection).use(walletAdapterIdentity(wallet));
  // { token: "2f98fb60.b4a6a680f35948fc99a782779657935e" }
  // umi.use(nftStorage());
  const [imageUri] = await umi.uploader.upload([imageFile]);
  const uri = await umi.uploader.uploadJson({
    name: "My NFT",
    description: "This is my NFT",
    image: imageUri,
  });
  return uri;
};

export const mintNft = (uri) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection).use(walletAdapterIdentity(wallet));
  const asset = generateSigner(umi);

  const result = createV1(umi, {
    asset: asset,
    name: "My Nft",
    uri: uri,
  }).sendAndConfirm(umi);
  return result;
};
