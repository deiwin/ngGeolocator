/*jshint -W072 */
(function() {
  'use strict';
  var module = angular.module('ngGeolocator', ['ngGeolocatorConstants']);

  /**
   * @constructs Locator
   * @param {google.maps.Marker} marker - The marker on the map that indicates the user's location
   */
  function Locator(marker) {
    this.marker = marker;
  }

  /**
   * @typedef LatLng
   * @type {Object}
   * @property {number} lat - The latitude.
   * @property {number} lng - The longitude.
   */

  /**
   * @returns {LatLng} The current user's selected position.
   */
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

      /**
       * Asynchorously loads the Google Maps API by appending it's script to the
       * DOM body element.
       *
       * @param {string} [key] The Google Maps API key.
       * @returns {Promise} A promise that will be resolved when Google Maps has
       * been initialized.
       */
      function loadMapsAPI(key) {
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
        return mapsAPIPromise;
      }

      /**
       * Tries to get the users current location using the HTML5 Geolocation API
       * and returns a promise for the position response from the Geolocation API.
       * If the users declines or does not respond in time, the map promise will
       * be used to draw an infobox on the map if/when the map is created and this
       * methods promise will be rejected the failure message.
       *
       * @param {Promise} mapPromise
       * @returns {Promise}
       */
      function loadUserLocation(mapPromise) {
        if (!$window.navigator.geolocation) {
          return handleNoGeolocation(mapPromise, 'Your browser doesn\'t support geolocation.');
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
        return geolocationPromise.catch(function() {
          return handleNoGeolocation(mapPromise, 'The Geolocation service failed.');
        });
      }

      function handleNoGeolocation(mapPromise, error) {
        mapPromise.then(function(map) {
          var options = {
            position: new $window.google.maps.LatLng(60, 105),
            content: 'Error: '+error,
          };
          var infoWindow = new $window.google.maps.InfoWindow(options);
          infoWindow.setMap(map);
          map.setCenter(options.position);
        });
        return $q.reject(error);
      }

      /**
       * Create a static marker for the given position and draw a circle with the accuracy
       * radius around it.
       */
      function createGeoEstimateElements(map, position) {
        var pos = converToLatLng(position);
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
      }

      function centerMapOn(map, position) {
        var pos = converToLatLng(position);
        map.setCenter(pos);
      }

      function converToLatLng(position) {
        return new $window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      }

      function initMap(canvasID) {
        var mapOptions = {
          zoom: 17,
        };
        return new $window.google.maps.Map($window.document.getElementById(canvasID), mapOptions);
      }

      function createLocatorMarker(map, position) {
        var pos = converToLatLng(position);
        return new $window.google.maps.Marker({
          draggable: true,
          zIndex: 3,
          map: map,
          position: pos,
        });
      }
      return {
        /**
         * create will initialize google maps, if it isn't already initialized and
         * will then initialize a map on the specified canvasID. Once the user has
         * accepted to share their location, the map will be centered to that location
         * and a marker will be displayed that the user can move to confirm/specify
         * their actual location.
         *
         * @param {string} canvasID - The elemt ID of the canvas to load the map onto.
         * @param {string} [key]    - Google Maps API key to be used for initializing the API.
         * @returns {Locator}
         */
        create: function(canvasID, key) {
          var mapsAPIPromise = loadMapsAPI(key);
          var mapPromise = mapsAPIPromise.then(function() {
            return initMap(canvasID);
          });
          var userLocationPromise = loadUserLocation(mapPromise);

          return $q.all({
            map: mapPromise,
            pos: userLocationPromise,
          }).then(function(asyncResults) {
            var map = asyncResults.map;
            var pos = asyncResults.pos;

            var locatorMarker = createLocatorMarker(map, pos);
            centerMapOn(map, pos);
            createGeoEstimateElements(map, pos);
            return new Locator(locatorMarker);
          });
        },
      };
    }
  ]);
})();
