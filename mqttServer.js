import mqtt from 'mqtt';
import dataEntry from './controllers/dataEntry.js';

// Use a public test broker or configure your own
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://test.mosquitto.org:1883';
const TOPIC = 'medi3buddy/data';

const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(TOPIC, (err) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to topic: ${TOPIC}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    console.log(`Received message on ${topic}`);
    
    const payload = JSON.parse(message.toString());
    const { healthDataJson, patientId } = payload;
    
    if (!healthDataJson || !patientId) {
      console.error('Missing healthDataJson or patientId');
      return;
    }
    
    const result = await dataEntry.postToPinata(
      JSON.stringify(healthDataJson),
      patientId
    );
    
    console.log('Data successfully uploaded:', result.upload.cid);
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

export default client;
