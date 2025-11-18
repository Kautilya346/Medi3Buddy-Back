import dotenv from "dotenv";
import { PinataSDK } from "pinata";

dotenv.config();

if (!process.env.PINATA_JWT) {
  console.warn(
    "PINATA_JWT is not set. Please verify your .env configuration before attempting uploads."
  );
}

const Pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "indigo-payable-narwhal-178.mypinata.cloud",
});

export default Pinata;
