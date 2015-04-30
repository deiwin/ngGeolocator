/**
 * @namespace ngGeolocator
 */
(function() {
  'use strict';
  /**
   * @constructor
   * @memberof ngGeolocator
   *
   * @param {google.maps.Marker} marker - The marker on the map that indicates the user's location
   */
  function Locator(marker) {
    /**
     * @typedef LatLng
     * @type {Object}
     * @property {number} lat - The latitude.
     * @property {number} lng - The longitude.
     * @memberof ngGeolocator
     */

    /**
     * @returns {LatLng} The current user's selected position.
     */
    this.getLocation = function() {
      var location = marker.getPosition();
      return {
        lat: location.lat(),
        lng: location.lng(),
      };
    };
  }


  /**
   * @constructor
   * @memberof ngGeolocator
   */
  function LocatorService($window, $q, $timeout, staticMarkerURL, optionsExtenders, googleMapsAPIKey) {
    var mapsAPIPromise, geolocationPromise;

    /**
     * create will initialize google maps, if it isn't already initialized, and
     * will then draw a map on the specified canvasID. Once the user has
     * accepted to share their location, the map will be centered to that location
     * and a marker will be displayed that the user can move to confirm/specify
     * their actual location. This marker will then be used to create a new
     * {@link Locator} object which will then be used to resolve the returned promise.
     *
     * @param {string} canvasID - The elemt ID of the canvas to load the map onto.
     * @returns {Promise.<Locator>}
     */
    this.create = function(canvasID) {
      var mapsAPIPromise = loadMapsAPI();
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
        createStaticGeoEstimateElements(map, pos);
        return new Locator(locatorMarker);
      });
    };

    /**
     * Asynchorously loads the Google Maps API by appending it's script to the
     * DOM body element.
     *
     * @returns {Promise} A promise that will be resolved when Google Maps has
     * been initialized.
     */
    function loadMapsAPI() {
      if (!mapsAPIPromise) {
        var mapsDefer = $q.defer();
        mapsAPIPromise = mapsDefer.promise;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=googleMapsInitialized';
        if (googleMapsAPIKey) {
          script.src += '&key=' + googleMapsAPIKey;
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
          content: 'Error: ' + error,
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
    function createStaticGeoEstimateElements(map, position) {
      var pos = converToLatLng(position);
      var marker = new $window.google.maps.Marker({
        clickable: false,
        cursor: 'pointer',
        draggable: false,
        flat: true,
        icon: {
          url: staticMarkerURL,
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
      if (optionsExtenders.map) {
        angular.extend(mapOptions, optionsExtenders.map($window.google.maps));
      }
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
  }

  /**
   * @constructor
   * @memberof ngGeolocator
   */
  function LocatorServiceProvider(staticMarkerURL) {
    var optionsExtenders = {};
    var googleMapsAPIKey;

    /**
     * Configure the service to use the specified Google Maps API Key.
     *
     * @param {string} googleMapsAPIKey
     */
    this.setGoogleMapsAPIKey = function(_googleMapsAPIKey_) {
      googleMapsAPIKey = _googleMapsAPIKey_;
    };

    /**
     * The {@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions|google.maps.MapOptions}
     * used to initialize the map will be extended using the provided function or object. If the extender is an object it will
     * simply be used to extend (using {@link https://docs.angularjs.org/api/ng/function/angular.extend|angular.extend})
     * the options object used to initialize the map. If, instead, the extender is a function, it will be called with the API
     * (<code>google.maps</code>) once Google Maps is loaded. An object used to extend <code>MapOptions</code> is expected as
     * the return value of the function.
     *
     * @example <caption>Using an object</caption>
     * ngGeolocatorProvider.extendMapOptions({
     *   zoom: 15,
     * });
     *
     * @example <caption>Using a function</caption>
     * ngGeolocatorProvider.extendMapOptions(function(maps) {
     *   return {
     *     center: maps.LatLng(10, 20),
     *   };
     * });
     *
     * @param {(Object|function(google.maps): Object)} extender
     */
    this.extendMapOptions = function(extender) {
      if (typeof(extender) !== 'function') {
        extender = wrapAsFunction(extender);
      }
      optionsExtenders.map = extender;
    };

    this.$get = ['$window', '$q', '$timeout',
      function($window, $q, $timeout) {
        return new LocatorService($window, $q, $timeout, staticMarkerURL, optionsExtenders, googleMapsAPIKey);
      }
    ];

    function wrapAsFunction(obj) {
      return function() {
        return obj;
      };
    }
  }

  angular.module('ngGeolocator', ['ngGeolocatorConstants'])
    .provider('ngGeolocator', ['staticMarkerURL', LocatorServiceProvider]);
})();
