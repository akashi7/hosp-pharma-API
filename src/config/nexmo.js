import Nexmo from "nexmo";
import { config } from "dotenv";

config();

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});


export { nexmo };