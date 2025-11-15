import Pinata from "../Utils/pinata.js";
import { v4 as uuidv4 } from "uuid";

async function post(healthDataJson) {
  console.log(process.env.PINATA_JWT);

  try {
    if (!healthDataJson || healthDataJson === "undefined") {
      throw new Error("Invalid or missing health data JSON");
    }
    const healthData = JSON.parse(healthDataJson);
    const file = new File(
      [JSON.stringify(healthData)],
      `healthData_${uuidv4()}.json`,
      {
        type: "application/json",
      }
    );
    const upload = await Pinata.upload.public.file(file);
    console.log(upload);
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to be caught in the route
  }
}

export default post;
