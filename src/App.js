import React, { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import './index.css'
import './styles.css'
import 'typeface-smokum'
import bg from './bg.webp'
import FindaCart from './FindaCart.png'
import a500Logo from './a500Logo.png'

function App() {
  const [location, setLocation] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [foodTrucks, setFoodTrucks] = useState([]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFoodItemsChange = (event) => {
    setFoodItems(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.get(
        'https://data.sfgov.org/resource/rqzj-sfat.json'
      );
      const data = response.data;
  
      const filteredFoodTrucks = data.filter((truck) => {
        const isLocationMatch =
          truck.address &&
          truck.address.toLowerCase().includes(location.toLowerCase());
      
        const isFoodItemsMatch =
          truck.fooditems &&
          truck.fooditems.toLowerCase().includes(foodItems.toLowerCase());
      
        const isFoodItemsArrayMatch =
          Array.isArray(truck.fooditems) &&
          truck.fooditems.some(
            (item) => item.toLowerCase().includes(foodItems.toLowerCase())
          );
      
        console.log('Location:', isLocationMatch);
        console.log('Food Items:', isFoodItemsMatch || isFoodItemsArrayMatch);
      
        return isLocationMatch && (isFoodItemsMatch || isFoodItemsArrayMatch);
      });
  
      console.log('Filtered Food Trucks:', filteredFoodTrucks); // Add this line to log the filtered food trucks

      const formattedFoodTrucks = filteredFoodTrucks.map((truck) => ({
        ...truck,
        latitude: parseFloat(truck.latitude),
        longitude: parseFloat(truck.longitude),
      }));

      setFoodTrucks(formattedFoodTrucks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-4/5 md:w-4/5 h-2/3 md:h-4/5 border-4 border-white rounded-3xl overflow-hidden">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            className="h-full w-full"
            style={{ position: 'absolute', zIndex: 0 }}
          >
            {/* Your map content */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="Map data © OpenStreetMap contributors"
            />
            {foodTrucks.map((truck) => (
              <Marker
                key={truck.objectid}
                position={[truck.latitude, truck.longitude]}
                icon={L.icon({
                  iconUrl:
                    'https://cdn-icons-png.flaticon.com/512/683/683071.png',
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                })}
              >
                <Popup>
                  <h3 className="text-lg font-bold">{truck.applicant}</h3>
                  <p className="text-sm">Cuisine: {truck.fooditems}</p>
                  <p className="text-sm">Address: {truck.address}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div
            className="absolute top-4 right-4 bg-amber-50 p-4 max-w-xs md:max-w-sm w-11/12 md:w-2/3 lg:w-1/2 rounded-3xl"
            style={{ zIndex: 1 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col items-center h-full">
              <div className="flex flex-col items-center justify-center flex-grow">
                <img
                  className="h-8 md:h-16 object-contain mb-4"
                  src={FindaCart}
                  alt="Find a Cart"
                />
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={handleLocationChange}
                    className="p-3 border border-gray-300 rounded mr-2 w-full text-base md:text-lg"
                    placeholder="Where at?"
                  />
                  <input
                    type="text"
                    id="foodItems"
                    value={foodItems}
                    onChange={handleFoodItemsChange}
                    className="p-3 border border-gray-300 rounded mr-2 w-full text-base md:text-lg"
                    placeholder="Food type?"
                  />
                  <button
                    type="submit"
                    className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded text-base md:text-lg"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App
