var stockholm = new google.maps.LatLng(59.32522, 18.07002);
var parliament = new google.maps.LatLng(59.327383, 18.06747);

var marker;
var markers = [];
var map;

var infoWindow = new google.maps.InfoWindow({
  maxWidth: 400
});



function initialize() {
  var mapOptions = {
    zoom: 4,
    center: stockholm
  };

  map = new google.maps.Map(document.getElementById('gmap'), mapOptions);

  marker = new google.maps.Marker({
    map:map,
    position: parliament
  });

  getToken();

  //google.maps.event.addListener(marker, 'click', toggleBounce);
}

function toggleBounce() {

  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


function getToken(){

  $.ajax({
      type: "POST",
      url: "http://localhost:8800/authenticate",
      data: { username: 'profilesModule', password: 'PrOfIlEmOdUlE'},
      dataType: "json",
      success: function(data) {
        console.log(data.token);
        getAntennaes(data.token);

      }
  });
}

function getAntennaes(token){

    $.ajax({
        type: "GET",
        url: "http://localhost:8800/antennae",
        data: { token: token},
        dataType: "json",
        success: function(data) {
          console.log(data);
          for (i = 0; i < data.length; i++) {
              var local = data[i];
              addMarker(local);
          }
        },
        error: function(request, status, err){
          console.log(err);
        }
    });
};


function addMarker(local){

  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(local.latitude, local.longitude),
      map: map,
      title: local.bodyNameAscii,
      icon: {
        path: fontawesome.markers.CIRCLE,
        scale: 0.15,
        strokeWeight: 0,
        strokeColor: 'blue',
        strokeOpacity: 1,
        fillColor: 'blue',
        fillOpacity: 1,
      },
  });

  var content = '<div id="infoWin"><h4>AEGEE-'+local.bodyNameAscii+'</h4></div>';

    google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
  markers.push(marker);
}



google.maps.event.addDomListener(window, 'load', initialize);

