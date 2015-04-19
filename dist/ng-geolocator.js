/*!
 * ng-geolocator v0.0.1
 * https://github.com/deiwin/ngGeolocator
 *
 * Let the user tell you where they are with the aid of HTML5 Geolocation API and Google Maps
 *
 * Copyright 2015, Deiwin Sarjas <deiwin.sarjas@gmail.com>
 * Released under the MIT license
 */
(function(angular, undefined) {
  'use strict';

  // src/js/geolocation.constants.js
  (function() {
    'use strict';
    /*jshint ignore:start*/
    angular.module('ngGeolocatorConstants', [])
      .constant('geolocationIndicator', 'data:image/png;base64,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');
    /*jshint ignore:end*/
  })();

  // src/js/geolocator.service.js
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
})(window.angular);
