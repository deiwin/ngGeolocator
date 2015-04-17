/*jshint -W072 */
(function() {
  'use strict';
  var module = angular.module('ngGeolocator', ['ngGeolocatorConstants']);

  /**
   * @constructor
   * @param {google.maps.Marker} marker - The marker on the map that indicates the user's location
   * @param {Promise} readyPromise      - Promise that will be resolved when the marker is ready
   *                                    to be queried for the user's location.
   */
  function Locator(marker, readyPromise) {
    this.marker = marker;
    this.readyPromise = readyPromise;
  }
  Locator.prototype.getLocation = function() {
    var location = this.marker.getPosition();
    return {
      lat: location.lat(),
      lng: location.lng(),
    };
  };

  module.factory('ngGeolocator', ['$window', '$q', '$timeout', 'geolocationIndicator',
    function($window, $q, $timeout, geolocationIndicator) {
      var mapsAPIPromise, geolocationPromise;

      function loadMap(canvasID, key) {
        if (!mapsAPIPromise) {
          var mapsDefer = $q.defer();
          mapsAPIPromise = mapsDefer.promise;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=googleMapsInitialized';
          if (key) {
            script.src += '&key=' + key;
          }
          $window.googleMapsInitialized = mapsDefer.resolve;
          $window.document.body.appendChild(script);
        }
        return mapsAPIPromise.then(function() {
          var map = initMap(canvasID);
          var locatorMarker = initLocatorMarker(map);
          var readyPromise = centerOnUsersLocation(map, locatorMarker);
          return new Locator(locatorMarker, readyPromise);
        });
      }

      function handleNoGeolocation(map, errorFlag) {
        var content;
        if (errorFlag) {
          content = 'Error: The Geolocation service failed.';
        } else {
          content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
          position: new $window.google.maps.LatLng(60, 105),
          content: content,
        };

        var infowindow = new $window.google.maps.InfoWindow(options);
        infowindow.setMap(map);
        map.setCenter(options.position);
      }

      function centerOnUsersLocation(map, locatorMarker) {
        if (!$window.navigator.geolocation) {
          handleNoGeolocation(map, false);
          return $q.reject('Geolocation service not supported.');
        }
        if (!geolocationPromise) {
          var geolocationDefer = $q.defer();
          geolocationPromise = geolocationDefer.promise;
          $window.navigator.geolocation.getCurrentPosition(geolocationDefer.resolve, geolocationDefer.reject);
          var timeoutPromise = $timeout(function() {
            geolocationDefer.reject('Timed out');
          }, 10000);
          geolocationPromise.then(function() {
            $timeout.cancel(timeoutPromise);
          });
        }
        return geolocationPromise.then(function(position) {
          var pos = new $window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var marker = new $window.google.maps.Marker({
            clickable: false,
            cursor: 'pointer',
            draggable: false,
            flat: true,
            icon: {
              url: geolocationIndicator,
              size: new $window.google.maps.Size(34, 34),
              scaledSize: new $window.google.maps.Size(17, 17),
              origin: new $window.google.maps.Point(0, 0),
              anchor: new $window.google.maps.Point(8, 8)
            },
            title: 'Current location',
            zIndex: 2,
            position: pos,
          });
          marker.setMap(map);
          var circle = new $window.google.maps.Circle({
            clickable: false,
            radius: position.coords.accuracy,
            strokeColor: '1bb6ff',
            strokeOpacity: 0.4,
            fillColor: '61a0bf',
            fillOpacity: 0.4,
            strokeWeight: 1,
            zIndex: 1,
            center: pos,
          });
          circle.setMap(map);
          locatorMarker.setPosition(pos);

          map.setCenter(pos);
        }, function() {
          handleNoGeolocation(map, true);
          return $q.reject('Geolocation service failed.');
        });
      }

      function initMap(canvasID) {
        var mapOptions = {
          zoom: 17,
        };
        return new $window.google.maps.Map($window.document.getElementById(canvasID), mapOptions);
      }

      function initLocatorMarker(map) {
        return new $window.google.maps.Marker({
          draggable: true,
          zIndex: 3,
          map: map,
        });
      }
      return {
        /**
         * loadMap will initialize google maps, if it isn't already initialized and
         * will then initialize a map on the specified canvasID. Once the user has
         * accepted to share their location the map will be centered to that location
         * and a marker will be displayed that the user can move to confirm/specify
         * their actual location.
         *
         * @param {string} canvasID - The elemt ID of the canvas to load the map onto.
         * @param {string} [key]    - Google Maps API key to be used for initializing the API.
         * @returns {Locator}
         */
        loadMap: loadMap,
      };
    }
  ]);
})();
