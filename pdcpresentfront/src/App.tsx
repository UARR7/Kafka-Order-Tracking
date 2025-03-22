

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { motion } from "framer-motion";
// import { Package, MapPin, RefreshCw } from "lucide-react";
// import "leaflet/dist/leaflet.css";

// // Fix for Leaflet marker icons
// import L from "leaflet";

// // Create custom markers for different statuses
// const createCustomIcon = (color: string) => {
//   return L.divIcon({
//     className: 'custom-marker',
//     html: `
//       <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
//         <circle cx="12" cy="12" r="6" fill="white"/>
//       </svg>
//     `,
//     iconSize: [24, 36],
//     iconAnchor: [12, 36],
//     popupAnchor: [0, -36],
//   });
// };

// const statusIcons = {
//   "Processing": createCustomIcon("#EAB308"), // Yellow
//   "Ready": createCustomIcon("#3B82F6"),      // Blue
//   "Delivered": createCustomIcon("#22C55E"),   // Green
//   "Order Received": createCustomIcon("#6B7280"), // Gray
// };

// function App() {
//   const [orders, setOrders] = useState<Record<string, any>>({});
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [selectedOrderId, setSelectedOrderId] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8080");

//     socket.onopen = () => {
//       console.log("✅ WebSocket Connected!");
//       setConnected(true);
//     };

//     socket.onerror = (error) => {
//       console.error("❌ WebSocket Error:", error);
//       setConnected(false);
//     };

//     socket.onclose = () => {
//       setConnected(false);
//     };

//     socket.onmessage = (event) => {
//       const { type, data } = JSON.parse(event.data);
//       setOrders((prev) => ({ ...prev, [data.orderId]: data }));
//     };

//     setWs(socket);
//     return () => socket.close();
//   }, []);

//   const updateOrderStatus = () => {
//     if (!ws || ws.readyState !== WebSocket.OPEN || !selectedOrderId || !selectedStatus) return;
//     ws.send(JSON.stringify({ orderId: Number(selectedOrderId), status: selectedStatus }));
//     console.log("✅ Order Update Sent");
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Processing":
//         return "bg-yellow-500";
//       case "Ready":
//         return "bg-blue-500";
//       case "Delivered":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
//       {/* Aurora Effect */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="aurora-blur absolute -inset-[10px] opacity-30">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, 90, 180],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//             className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
//           />
//         </div>
//       </div>

//       <div className="relative z-10 container mx-auto p-4">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <Package className="w-8 h-8" />
//             <h1 className="text-4xl font-bold">Real-Time Order Tracking</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
//             <span>{connected ? 'Connected' : 'Disconnected'}</span>
//           </div>
//         </div>

//         <div className="bg-gray-800 rounded-xl p-6 mb-6 backdrop-blur-lg bg-opacity-50">
//           <div className="flex flex-wrap gap-4 items-end">
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium mb-2">Order ID</label>
//               <input
//                 type="number"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Enter Order ID"
//                 value={selectedOrderId}
//                 onChange={(e) => setSelectedOrderId(e.target.value)}
//               />
//             </div>
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium mb-2">Status</label>
//               <select
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//               >
//                 <option value="">Select Status</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Ready">Ready</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//             <button
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
//               onClick={updateOrderStatus}
//             >
//               <RefreshCw className="w-4 h-4" />
//               Update Order
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-xl overflow-hidden backdrop-blur-lg bg-opacity-50">
//               <MapContainer
//                 center={[20, 78]}
//                 zoom={4}
//                 className="h-[600px] w-full z-0"
//                 zoomControl={false}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   className="brightness-[0.7] contrast-[1.2]"
//                 />
//                 {Object.values(orders).map((order: any) => (
//                   <Marker
//                     key={order.orderId}
//                     position={[order.location.lat, order.location.lng]}
//                     icon={statusIcons[order.status] || statusIcons["Order Received"]}
//                   >
//                     <Popup className="bg-gray-800 text-white">
//                       <div className="p-2">
//                         <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
//                         <p className="text-sm">Status: {order.status}</p>
//                         <p className="text-sm">
//                           Location: {order.location.lat.toFixed(4)}, {order.location.lng.toFixed(4)}
//                         </p>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>
//             </div>
//           </div>

//           <div className="bg-gray-800 rounded-xl p-4 backdrop-blur-lg bg-opacity-50 h-[600px] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <MapPin className="w-5 h-5" />
//               Active Orders
//             </h2>
//             <div className="space-y-3">
//               {Object.values(orders).map((order: any) => (
//                 <div
//                   key={order.orderId}
//                   className="bg-gray-700 rounded-lg p-4 transition-all hover:scale-[1.02]"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-semibold">Order #{order.orderId}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-300">
//                     <p>Lat: {order.location.lat.toFixed(4)}</p>
//                     <p>Lng: {order.location.lng.toFixed(4)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

//////////
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { motion } from "framer-motion";
// import { Package, MapPin, RefreshCw, BarChart3 } from "lucide-react";
// import "leaflet/dist/leaflet.css";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Fix for Leaflet marker icons
// import L from "leaflet";

// // Create custom markers for different statuses
// const createCustomIcon = (color: string) => {
//   return L.divIcon({
//     className: 'custom-marker',
//     html: `
//       <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
//         <circle cx="12" cy="12" r="6" fill="white"/>
//       </svg>
//     `,
//     iconSize: [24, 36],
//     iconAnchor: [12, 36],
//     popupAnchor: [0, -36],
//   });
// };

// const statusIcons = {
//   "Processing": createCustomIcon("#EAB308"), // Yellow
//   "Ready": createCustomIcon("#3B82F6"),      // Blue
//   "Delivered": createCustomIcon("#22C55E"),   // Green
//   "Order Received": createCustomIcon("#6B7280"), // Gray
// };

// // Famous places in Coimbatore with their coordinates
// const famousPlaces = {
//   "Gandhipuram": { lat: 11.0183, lng: 76.9725 },
//   "Peelamedu": { lat: 11.0290, lng: 77.0210 },
//   "Saibaba Colony": { lat: 11.0284, lng: 76.9516 },
//   "Town Hall": { lat: 10.9940, lng: 76.9631 },
//   "Ukkadam": { lat: 10.9917, lng: 76.9552 },
//   "Singanallur": { lat: 11.0004, lng: 77.0293 },
//   "Ramanathapuram": { lat: 10.9951, lng: 77.0050 },
//   "Saravanampatti": { lat: 11.0883, lng: 76.9946 },
//   "Koundampalayam": { lat: 11.0542, lng: 76.9508 },
//   "Thudiyalur": { lat: 11.0775, lng: 76.9489 },
//   "Ganapathy": { lat: 11.0444, lng: 76.9814 },
//   "Kovaipudur": { lat: 10.9609, lng: 76.9211 },
//   "Sundarapuram": { lat: 10.9543, lng: 76.9821 },
//   "Vadavalli": { lat: 11.0333, lng: 76.8989 },
//   "Kinathukadavu": { lat: 10.8396, lng: 77.0042 }
// };

// function App() {
//   const [orders, setOrders] = useState<Record<string, any>>({});
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [selectedOrderId, setSelectedOrderId] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [showTrends, setShowTrends] = useState(false);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8080");

//     socket.onopen = () => {
//       console.log("✅ WebSocket Connected!");
//       setConnected(true);
//     };

//     socket.onerror = (error) => {
//       console.error("❌ WebSocket Error:", error);
//       setConnected(false);
//     };

//     socket.onclose = () => {
//       setConnected(false);
//     };

//     socket.onmessage = (event) => {
//       const { type, data } = JSON.parse(event.data);
//       setOrders((prev) => ({ ...prev, [data.orderId]: data }));
//     };

//     setWs(socket);
//     return () => socket.close();
//   }, []);

//   const updateOrderStatus = () => {
//     if (!ws || ws.readyState !== WebSocket.OPEN || !selectedOrderId || !selectedStatus) return;
//     ws.send(JSON.stringify({ orderId: Number(selectedOrderId), status: selectedStatus }));
//     console.log("✅ Order Update Sent");
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Processing":
//         return "bg-yellow-500";
//       case "Ready":
//         return "bg-blue-500";
//       case "Delivered":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // Calculate orders per location
//   const getOrdersByLocation = () => {
//     const locationCounts: Record<string, number> = {};
    
//     Object.values(orders).forEach(order => {
//       const place = Object.entries(famousPlaces).find(([_, coords]) => 
//         Math.abs(coords.lat - order.location.lat) < 0.01 && 
//         Math.abs(coords.lng - order.location.lng) < 0.01
//       );
      
//       if (place) {
//         locationCounts[place[0]] = (locationCounts[place[0]] || 0) + 1;
//       }
//     });

//     return locationCounts;
//   };

//   const orderTrendsData = {
//     labels: Object.keys(getOrdersByLocation()),
//     datasets: [
//       {
//         label: 'Number of Orders',
//         data: Object.values(getOrdersByLocation()),
//         backgroundColor: 'rgba(59, 130, 246, 0.8)',
//         borderColor: 'rgba(59, 130, 246, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//         labels: {
//           color: 'white',
//         },
//       },
//       title: {
//         display: true,
//         text: 'Orders by Location in Coimbatore',
//         color: 'white',
//         font: {
//           size: 16,
//         },
//       },
//     },
//     scales: {
//       y: {
//         ticks: {
//           color: 'white',
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//         },
//       },
//       x: {
//         ticks: {
//           color: 'white',
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//         },
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
//       {/* Aurora Effect */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="aurora-blur absolute -inset-[10px] opacity-30">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, 90, 180],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//             className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
//           />
//         </div>
//       </div>

//       <div className="relative z-10 container mx-auto p-4">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <Package className="w-8 h-8" />
//             <h1 className="text-4xl font-bold">Real-Time Order Tracking</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setShowTrends(!showTrends)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//             >
//               <BarChart3 className="w-4 h-4" />
//               {showTrends ? 'Hide Trends' : 'Show Trends'}
//             </button>
//             <div className="flex items-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
//               <span>{connected ? 'Connected' : 'Disconnected'}</span>
//             </div>
//           </div>
//         </div>

//         {showTrends && (
//           <div className="bg-gray-800 rounded-xl p-6 mb-6 backdrop-blur-lg bg-opacity-50">
//             <Bar data={orderTrendsData} options={chartOptions} />
//           </div>
//         )}

//         <div className="bg-gray-800 rounded-xl p-6 mb-6 backdrop-blur-lg bg-opacity-50">
//           <div className="flex flex-wrap gap-4 items-end">
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium mb-2">Order ID</label>
//               <input
//                 type="number"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Enter Order ID"
//                 value={selectedOrderId}
//                 onChange={(e) => setSelectedOrderId(e.target.value)}
//               />
//             </div>
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium mb-2">Status</label>
//               <select
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//               >
//                 <option value="">Select Status</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Ready">Ready</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//             <button
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
//               onClick={updateOrderStatus}
//             >
//               <RefreshCw className="w-4 h-4" />
//               Update Order
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-xl overflow-hidden backdrop-blur-lg bg-opacity-50">
//               <MapContainer
//                 center={[11.0168, 76.9558]}
//                 zoom={12}
//                 className="h-[600px] w-full z-0"
//                 zoomControl={false}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   className="brightness-[0.7] contrast-[1.2]"
//                 />
//                 {Object.values(orders).map((order: any) => (
//                   <Marker
//                     key={order.orderId}
//                     position={[order.location.lat, order.location.lng]}
//                     icon={statusIcons[order.status] || statusIcons["Order Received"]}
//                   >
//                     <Popup className="bg-gray-800 text-white">
//                       <div className="p-2">
//                         <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
//                         <p className="text-sm">Status: {order.status}</p>
//                         <p className="text-sm">
//                           Location: {order.location.lat.toFixed(4)}, {order.location.lng.toFixed(4)}
//                         </p>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>
//             </div>
//           </div>

//           <div className="bg-gray-800 rounded-xl p-4 backdrop-blur-lg bg-opacity-50 h-[600px] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <MapPin className="w-5 h-5" />
//               Active Orders
//             </h2>
//             <div className="space-y-3">
//               {Object.values(orders).map((order: any) => (
//                 <div
//                   key={order.orderId}
//                   className="bg-gray-700 rounded-lg p-4 transition-all hover:scale-[1.02]"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-semibold">Order #{order.orderId}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-300">
//                     <p>Lat: {order.location.lat.toFixed(4)}</p>
//                     <p>Lng: {order.location.lng.toFixed(4)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { motion } from "framer-motion";
import { Package, MapPin, RefreshCw, BarChart3 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fix for Leaflet marker icons
import L from "leaflet";

// Create custom markers for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
        <circle cx="12" cy="12" r="6" fill="white"/>
      </svg>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
};

const statusIcons = {
  "Processing": createCustomIcon("#EAB308"), // Yellow
  "Ready": createCustomIcon("#3B82F6"),      // Blue
  "Delivered": createCustomIcon("#22C55E"),   // Green
  "Order Received": createCustomIcon("#6B7280"), // Gray
};

// Famous places in Coimbatore with their coordinates
const famousPlaces = {
  "Gandhipuram": { lat: 11.0183, lng: 76.9725 },
  "Peelamedu": { lat: 11.0290, lng: 77.0210 },
  "Saibaba Colony": { lat: 11.0284, lng: 76.9516 },
  "Town Hall": { lat: 10.9940, lng: 76.9631 },
  "Ukkadam": { lat: 10.9917, lng: 76.9552 },
  "Singanallur": { lat: 11.0004, lng: 77.0293 },
  "Ramanathapuram": { lat: 10.9951, lng: 77.0050 },
  "Saravanampatti": { lat: 11.0883, lng: 76.9946 },
  "Koundampalayam": { lat: 11.0542, lng: 76.9508 },
  "Thudiyalur": { lat: 11.0775, lng: 76.9489 },
  "Ganapathy": { lat: 11.0444, lng: 76.9814 },
  "Kovaipudur": { lat: 10.9609, lng: 76.9211 },
  "Sundarapuram": { lat: 10.9543, lng: 76.9821 },
  "Vadavalli": { lat: 11.0333, lng: 76.8989 },
  "Kinathukadavu": { lat: 10.8396, lng: 77.0042 }
};

// Radius in kilometers for location grouping
const LOCATION_RADIUS = 5;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function App() {
  const [orders, setOrders] = useState<Record<string, any>>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [connected, setConnected] = useState(false);
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("✅ WebSocket Connected!");
      setConnected(true);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      setConnected(false);
    };

    socket.onclose = () => {
      setConnected(false);
    };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500";
      case "Ready":
        return "bg-blue-500";
      case "Delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate orders per location within radius
  const getOrdersByLocation = () => {
    const locationCounts: Record<string, number> = {};
    const unassignedOrders: any[] = [];
    
    // Initialize counts
    Object.keys(famousPlaces).forEach(place => {
      locationCounts[place] = 0;
    });

    // Process each order
    Object.values(orders).forEach(order => {
      let nearestPlace = null;
      let shortestDistance = Infinity;

      // Find the nearest place within radius
      Object.entries(famousPlaces).forEach(([place, coords]) => {
        const distance = calculateDistance(
          order.location.lat,
          order.location.lng,
          coords.lat,
          coords.lng
        );

        if (distance < shortestDistance && distance <= LOCATION_RADIUS) {
          shortestDistance = distance;
          nearestPlace = place;
        }
      });

      if (nearestPlace) {
        locationCounts[nearestPlace]++;
      } else {
        unassignedOrders.push(order);
      }
    });

    // Filter out locations with no orders
    return Object.fromEntries(
      Object.entries(locationCounts).filter(([_, count]) => count > 0)
    );
  };

  const orderTrendsData = {
    labels: Object.keys(getOrdersByLocation()),
    datasets: [
      {
        label: `Number of Orders (Within ${LOCATION_RADIUS}km radius)`,
        data: Object.values(getOrdersByLocation()),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Orders by Location in Coimbatore',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Aurora Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-blur absolute -inset-[10px] opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Real-Time Order Tracking</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTrends(!showTrends)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              {showTrends ? 'Hide Trends' : 'Show Trends'}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {showTrends && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 backdrop-blur-lg bg-opacity-50">
            <Bar data={orderTrendsData} options={chartOptions} />
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 mb-6 backdrop-blur-lg bg-opacity-50">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Order ID</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter Order ID"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
              onClick={updateOrderStatus}
            >
              <RefreshCw className="w-4 h-4" />
              Update Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl overflow-hidden backdrop-blur-lg bg-opacity-50">
              <MapContainer
                center={[11.0168, 76.9558]}
                zoom={12}
                className="h-[600px] w-full z-0"
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="brightness-[0.7] contrast-[1.2]"
                />
                {/* Show radius circles for each location */}
                {Object.entries(famousPlaces).map(([place, coords]) => (
                  <Circle
                    key={`circle-${place}`}
                    center={[coords.lat, coords.lng]}
                    radius={LOCATION_RADIUS * 1000} // Convert km to meters
                    pathOptions={{
                      color: 'rgba(59, 130, 246, 0.2)',
                      fillColor: 'rgba(59, 130, 246, 0.1)',
                    }}
                  />
                ))}
                {Object.values(orders).map((order: any) => (
                  <Marker
                    key={order.orderId}
                    position={[order.location.lat, order.location.lng]}
                    icon={statusIcons[order.status] || statusIcons["Order Received"]}
                  >
                    <Popup className="bg-gray-800 text-white">
                      <div className="p-2">
                        <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                        <p className="text-sm">Status: {order.status}</p>
                        <p className="text-sm">
                          Location: {order.location.lat.toFixed(4)}, {order.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 backdrop-blur-lg bg-opacity-50 h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Active Orders
            </h2>
            <div className="space-y-3">
              {Object.values(orders).map((order: any) => (
                <div
                  key={order.orderId}
                  className="bg-gray-700 rounded-lg p-4 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Order #{order.orderId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p>Lat: {order.location.lat.toFixed(4)}</p>
                    <p>Lng: {order.location.lng.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;