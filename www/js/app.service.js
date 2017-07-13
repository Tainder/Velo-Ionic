var app = angular.module('app')
  .service('countriesService', function($http , apiHost){
    this.getList = function(){
      return $http.get(apiHost + 'countries')
    };

    this.getContrat = function($iso2){
      return $http.get(apiHost + 'countries/' + $iso2 +'/contracts')
    }

    this.getFullContrat = function(){
      return $http.get(apiHost + 'contracts')
    }

    this.getStations = function($idContrat){
      return $http.get(apiHost + 'contracts/' + $idContrat +'/stations')
    }
    this.calcCrow = function($lat1, $lon1, $lat2, $lon2)
      {
        var R = 6371; // km
        var dLat = this.toRad($lat2-$lat1);
        var dLon = this.toRad($lon2-$lon1);
        var lat1 = this.toRad($lat1);
        var lat2 = this.toRad($lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
      }
      this.toRad = function($deg) {
        return $deg * (Math.PI/180)
      }
  });
