mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: farm.geomatry.coordinates, // starting position [lng, lat]
    zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())

const marker1 = new mapboxgl.Marker()
.setLngLat(farm.geomatry.coordinates)
.setPopup(
    new mapboxgl.Popup({
        offset:20
    })
    .setHTML(
        `<h3>${farm.name}</h3> <p>${farm.location}</p>`
    )
)
.addTo(map);

