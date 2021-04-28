/**
 * this method is google maps direction initialisation
 */
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 46.2276, lng: 2.2137}
    });
    //display
    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay);

}
/**
 * this method calculate abd display the route in maps
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    if(departure != undefined){
        directionsService.route({
            origin: departure.lat+','+departure.lon ,
            destination:arrival.lat+','+arrival.lon,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}