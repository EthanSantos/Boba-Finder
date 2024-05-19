import React from 'react'

const BobaInfo = ({ name, address, location, place_id, rating }) => {
    return (
        <div>
            <h4>{name}</h4>
            <p>{address}</p>
            <p>Rating: {rating}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${location.lat}%2C${location.lng}&query_place_id=${place_id}`} target="_blank">Get directions</a>
        </div>
    )
}

export default BobaInfo
