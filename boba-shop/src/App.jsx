import React, { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import BobaInfo from './BobaInfo';

const App = () => {
  const [school, setSchool] = useState('');
  const [bobaPlaces, setBobaPlaces] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchName = async (placeId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/name', { // send request to flask server
        params: {
          place_id: placeId
        }
      });

      console.log(response.data.result)
      return response.data.result.name;
    } catch (err) {
      console.error('Places API error:', err);
      throw new Error('Error fetching name: ' + err.message);
    }
  };

  const fetchBobaPlaces = async (location) => { // gets boba places based on coordinates
    try {
      const response = await axios.get('http://localhost:5000/api/places', { // send request to flask server
        params: {
          keyword: "boba",
          location: `${location.lat},${location.lng}`,
          radius: 1500,
          rankPreference: "DISTANCE",
          type: "cafe"
        }
      });

      console.log(response.data.results)
      return response.data.results;
    } catch (err) {
      console.error('Places API error:', err);
      throw new Error('Error fetching boba places: ' + err.message);
    }
  };

  const handleSelect = async (selectedSchool) => {
    setSchool(selectedSchool);
    setLoading(true);
    setError('');
    setBobaPlaces([]);

    try {
      setSearch(null)
      const results = await geocodeByAddress(selectedSchool); // get geocode for the school
      console.log(results)
      const types = results[0].types
      if (types.includes('school') || types.includes("university")) { // check if its a school
        const name = await fetchName(results[0].place_id)
        setSearch(name)
        const coordinates = await getLatLng(results[0]);
        const places = await fetchBobaPlaces(coordinates);
        setBobaPlaces(places);
      } else {
        throw new Error('Please enter a school.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Please enter a school.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PlacesAutocomplete
        value={school}
        onChange={setSchool}
        onSelect={handleSelect}
        searchOptions={{ types: ['school'] }} // Restrict autocomplete to schools
      >
        {({ getInputProps }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Enter school',
                className: 'location-search-input',
              })}
            />
          </div>
        )}
      </PlacesAutocomplete>
      <button onClick={() => handleSelect(school)}>Search</button>
      {search && <p>Showing boba places near {search}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {bobaPlaces.map((place) => (
        <BobaInfo name={place.name} address={place.vicinity} location={place.geometry.location} place_id={place.place_id} rating={place.rating} />
      ))}
    </div>
  );
};

export default App;