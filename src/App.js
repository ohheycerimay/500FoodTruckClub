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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}>
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-4/5 md:w-4/5 h-2/3 md:h-4/5 border-4 border-white rounded-3xl overflow-hidden">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            className="h-full w-full"
            style={{ position: 'absolute', zIndex: 0 }}>
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
                })}>
                <Popup>
                  <h3 className="text-lg font-bold">{truck.applicant}</h3>
                  <p className="text-sm">Cuisine: {truck.fooditems}</p>
                  <p className="text-sm">Address: {truck.address}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div
            className="absolute top-4 right-4 bg-amber-50 p-4 max-w-xs md:max-w-xsm w-11/12 md:w-1/3 lg:w-1/2 h-92 md:h-1/6 rounded-3xl"
            style={{ zIndex: 1 }}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center">
              <label
                htmlFor="location"
                className="text-lg md:text-2xl text-slate-400 font-bold mb-4">
                <img
                  className="h-12 md:h-24"
                  src={FindaCart}
                  alt="Find a Cart"
                />
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  className="p-3 border border-gray-300 rounded mr-2 w-full text-base md:text-lg"
                  placeholder="Where ya at?"
                />
                <button
                  type="submit"
                  className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded ml-2 text-base md:text-lg">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
