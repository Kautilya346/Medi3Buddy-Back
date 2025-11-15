import Pinata from "../Utils/pinata.js";

async function post(healthDataJson) {
  console.log(process.env.PINATA_JWT);

  try {
    if (!healthDataJson || healthDataJson === "undefined") {
      throw new Error("Invalid or missing health data JSON");
    }
    const healthData = JSON.parse(healthDataJson);
    const file = new File(
      [JSON.stringify(healthData)],
      `healthData.${healthData.user_id}.json`,
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
