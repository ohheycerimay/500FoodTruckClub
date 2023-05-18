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
      <div className="bg-slate-400 inline-block rounded-lg">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-amber-50 font-bold font-smokum text-center py-4 px-8">
        <img className="h-80" src={a500Logo}/>
        </h1>
      </div>
      <div className="flex flex-col items-center bg-amber-50 mt-8 p-4 rounded-lg">
  <form className="w-full md:w-auto" onSubmit={handleSubmit}>
    <label htmlFor="location" className="text-lg md:text-2xl text-slate-400 font-bold mt-2 mb-4">
      <img className="h-64" src={FindaCart}/>
    </label>
    <div className="flex items-center">
      <input
        type="text"
        id="location"
        value={location}
        onChange={handleLocationChange}
        className="p-3 border border-gray-300 rounded mr-2 w-full"
        placeholder="Enter your location"
      />
      <button
        type="submit"
        className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded ml-2"
      >
        Search
      </button>
    </div>
  </form>
</div>

  
      <div className="w-full h-96 py-4 rounded">
  <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-full shadow-lg rounded">
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
          <h3 className="text-lg font-bold">{truck.applicant}</h3>
          <p className="text-sm">Cuisine: {truck.fooditems}</p>
          <p className="text-sm">Address: {truck.address}</p>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
</div>
        </div>
      </div>
      
    </div>
  )
}

export default App
