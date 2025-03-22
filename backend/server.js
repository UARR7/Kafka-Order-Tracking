const express = require("express");
const WebSocket = require("ws");
const { Kafka } = require("kafkajs");
const cors = require("cors");

const app = express();
const PORT = 5001;
app.use(express.json());
app.use(cors());

const kafka = new Kafka({ clientId: "order-tracking", brokers: ["localhost:9092"] });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-group" });

const wss = new WebSocket.Server({ port: 8080 });

let orders = {}; // Store order locations & statuses

const broadcast = (type, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
};

const run = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer Connected");

  await consumer.connect();
  await consumer.subscribe({ topic: "orders" });


await consumer.run({
    eachMessage: async ({ message }) => {
      let order = JSON.parse(message.value.toString());
      order.status = "Processing";
  
      // Ensure location stays within Coimbatore
      const randomWithinRange = (min, max) => Math.random() * (max - min) + min;
      order.location = { 
        lat: randomWithinRange(10.9, 11.2),  // Strictly within Coimbatore
        lng: randomWithinRange(76.9, 77.2)   // Strictly within Coimbatore
      };
  
      orders[order.orderId] = order;
      broadcast("consumed", order);
  
      await producer.send({
        topic: "processed-orders",
        messages: [{ value: JSON.stringify(order) }],
      });
    },
  });
  
};

wss.on("connection", (ws) => {
  ws.on("message", async (msg) => {
    const { orderId, status } = JSON.parse(msg);
    if (orders[orderId]) {
      orders[orderId].status = status;
      broadcast("updated", orders[orderId]);

      await producer.send({
        topic: "processed-orders",
        messages: [{ value: JSON.stringify(orders[orderId]) }],
      });
    }
  });
});

setInterval(async () => {
    const randomWithinRange = (min, max) => Math.random() * (max - min) + min;
  
    const order = {
      orderId: Math.floor(Math.random() * 1000),
      status: "Order Received",
      location: { 
        lat: randomWithinRange(10.9, 11.2),  // Strictly within Coimbatore
        lng: randomWithinRange(76.9, 77.2)   // Strictly within Coimbatore
      }
    };
  
    orders[order.orderId] = order;
  
    await producer.send({
      topic: "orders",
      messages: [{ value: JSON.stringify(order) }],
    });
  
    console.log("🔥 New Order:", order);
    broadcast("produced", order);
  }, 5000);
  

run().catch(console.error);
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
