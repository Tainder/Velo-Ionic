angular.module('app');

// creation du controleur
app.controller('countriesListController', function($scope, countriesService) {

  countriesService.getList()
    .then(function (response){
      $scope.countries = response.data;
    })
    .catch(function (error){
      console.error(error.message);
    });
});


app.controller('countryDetailController', function($scope, $stateParams ,  countriesService) {

    countriesService.getContrat($stateParams.iso2)
      .then(function(response){
        $scope.contracts = response.data;
        $scope.pays = $stateParams.pays
      })
      .catch(function (error){
        console.error(error.message);
      });
});

app.controller('stationDetailController', function($scope, $stateParams , countriesService , $interval) {

    this.afficheStations = function(){
      countriesService.getStations($stateParams.idContract)
      .then(function(response){
        $scope.stations = response.data;
        $scope.pays = $stateParams.pays
        $scope.contractName = $stateParams.contractName
      })
      .catch(function (error){
        console.error(error.message);
      });
    }

   var theInterval = $interval(this.afficheStations, 10000);

    $scope.$on('$destroy', function () {
        $interval.cancel(theInterval)
    });

   //invoke initialy
   this.afficheStations();

});


app.controller('currentPositionController', function($scope, $cordovaGeolocation, countriesService, $ionicLoading) {
  var posOptions = {timeout: 10000, enableHighAccuracy: false};


  $cordovaGeolocation

  .getCurrentPosition(posOptions)

  .then(function (position) {
  var CurrLat = position.coords.latitude
  var CurrLong = position.coords.longitude
  var distCountryProche = 0;
  var distStationProche = 0;
  var CountryProche;
  var MarkerProche;
  $scope.latitude = CurrLat
  $scope.longitude = CurrLong
  var pervMarker = 0;
  var prevWindow = 0;


  var tstLatLong;

  var myLatlng = new google.maps.LatLng(CurrLat,CurrLong);

        var mapOptions = {
            center: myLatlng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
        var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: '',
          icon : '/img/male.svg'
        });


    // On réucp toute les country pour voir le plus proche
    countriesService.getFullContrat()
      .then(function (response){
        angular.forEach(response.data, function(value, key) {
          tstLatLong = new google.maps.LatLng(value.latitude,value.longitude);
          var distObjCourant = google.maps.geometry.spherical.computeDistanceBetween(myLatlng, tstLatLong);

            if (distCountryProche == 0){
              CountryProche = value;
              //distCountryProche = countriesService.calcCrow(CurrLat , CurrLong , value.latitude , value.longitude);
              distCountryProche = distObjCourant
            }
            else{
                if(distCountryProche > distObjCourant){ //countriesService.calcCrow(CurrLat , CurrLong , value.latitude , value.longitude)){
                  CountryProche = value;
                  //distCountryProche = countriesService.calcCrow(CurrLat , CurrLong , value.latitude , value.longitude);
                  distCountryProche = distObjCourant
                }
            }
        });


        countriesService.getStations(CountryProche.id)
          .then(function (response){

            angular.forEach(response.data, function(value, key) {
              tstLatLong = new google.maps.LatLng(value.latitude,value.longitude);
              var marker = new google.maps.Marker({
                position: tstLatLong,
                map: map,
                title: '',
                icon : '/img/velo.svg'
              });

              var contentString = "<div>"+ value.name +"</div>";


              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });

              google.maps.event.addListener(marker, 'click', function() {
                if(!marker.open){
                  if (prevWindow != 0 && prevMarker != 0){
                    prevWindow.close();
                    prevMarker.open = false;
                  }

                    prevMarker = marker;
                    prevWindow = infowindow;


                    infowindow.open(map,marker);
                    marker.open = true;
                }
                else{

                    infowindow.close();
                    marker.open = false;
                }
               });

               var distObjCourant = google.maps.geometry.spherical.computeDistanceBetween(myLatlng, tstLatLong);

                if (distStationProche == 0){
                  CountryProche = value;
                  //distStationProche = countriesService.calcCrow(CurrLat , CurrLong , value.latitude , value.longitude);
                  distStationProche = distObjCourant
                  marker.icon = '/img/embassy.svg'
                  MarkerProche = marker;
                }
                else{
                  if(distStationProche > distObjCourant ){ //countriesService.calcCrow(CurrLat  , CurrLong , value.latitude , value.longitude)){
                      CountryProche = value;
                      //distStationProche = countriesService.calcCrow(CurrLat  , CurrLong , value.latitude , value.longitude);
                      distStationProche = distObjCourant;
                      MarkerProche.icon = '/img/velo.svg'
                      marker.icon = '/img/embassy.svg'
                      MarkerProche = marker;
                    }
                }

            });

          })




        .catch(function (error){
          console.error(error.message);
        });

      })


  }, function(err) {
      // error
    });
    $ionicLoading.hide();
});
