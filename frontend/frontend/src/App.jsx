import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [orders, setOrders] = useState({});
  const [ws, setWs] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => console.log("✅ WebSocket Connected!");
    socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      setOrders((prev) => ({ ...prev, [data.orderId]: data }));
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const updateOrderStatus = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !selectedOrderId || !selectedStatus) return;
    ws.send(JSON.stringify({ orderId: Number(selectedOrderId), status: selectedStatus }));
    console.log("✅ Order Update Sent");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Real-Time Order Tracking</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Order ID"
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Processing">Processing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={updateOrderStatus}>
          Update Order
        </button>
      </div>

      <MapContainer center={[20, 78]} zoom={4} className="h-[500px] w-full rounded-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {Object.values(orders).map((order) => (
          <Marker key={order.orderId} position={[order.location.lat, order.location.lng]}>
            <Popup>
              <div>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
