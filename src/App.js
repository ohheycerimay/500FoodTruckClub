import React, { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import './index.css';
import './styles.css'
import 'typeface-smokum'
import bg from './bg.webp'

function App() {
  const [location, setLocation] = useState('')
  const [foodTrucks, setFoodTrucks] = useState([])

  const handleLocationChange = (event) => {
    setLocation(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.get(
        'https://data.sfgov.org/resource/rqzj-sfat.json'
      )
      const data = response.data

      const filteredFoodTrucks = data.filter((truck) => {
        const isLocationMatch = truck.address
          .toLowerCase()
          .includes(location.toLowerCase())
        return isLocationMatch
      })

      const formattedFoodTrucks = filteredFoodTrucks.map((truck) => ({
        ...truck,
        latitude: parseFloat(truck.location.latitude),
        longitude: parseFloat(truck.location.longitude),
      }))

      setFoodTrucks(formattedFoodTrucks)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
      <div className="flex justify-center">
        <div className="container mx-auto py-8 px-4">
        <div className="bg-slate-400 inline-block">
  <h1 className="text-4xl text-amber-50 font-bold mb-6 font-smokum text-center py-4 px-8">
    500 Food Trucks Club
  </h1>
</div>
          <div className=" flex justify-center bg-amber-50 inline-block">
            <form className="flex justify-center mb-8 " onSubmit={handleSubmit}>
              <label htmlFor="location" className="text-4xl text-slate-400 font-bold mr-2 mt-6">
                Find Truck Locations Near You:
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={handleLocationChange}
                className="p-2 border border-gray-300 rounded mt-6"
              />
              <button
                type="submit"
                className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded ml-2 mt-6"
              >
                Search
              </button>
            </form>
          </div>
          <div className="w-full h-96 py-2 px-4 rounded">
            <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-full shadow-2xl">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data © OpenStreetMap contributors"
              />
              {foodTrucks.map((truck) => (
                <Marker
                  key={truck.objectid}
                  position={[truck.latitude, truck.longitude]}
                  icon={L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/683/683071.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                  })}
                >
                  <Popup>
                    <h3>{truck.applicant}</h3>
                    <p>Cuisine: {truck.fooditems}</p>
                    <p>Address: {truck.address}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default App
