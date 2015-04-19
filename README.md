ngGeolocator
======================

[![Build Status](https://travis-ci.org/deiwin/ngGeolocator.png)](https://travis-ci.org/deiwin/ngGeolocator)
[![Coverage Status](https://coveralls.io/repos/deiwin/ngGeolocator/badge.png?branch=master)](https://coveralls.io/r/deiwin/ngGeolocator?branch=master)
[![devDependency Status](https://david-dm.org/deiwin/ngGeolocator/dev-status.svg)](https://david-dm.org/deiwin/ngGeolocator#info=devDependencies)

Let the user tell you where they are with the aid of HTML5 Geolocation API and Google Maps.

A live demo: http://deiwin.github.io/ngGeolocator/

This project used [ChadKillingsworth/geolocation-marker](https://github.com/ChadKillingsworth/geolocation-marker) as a starting point.

Installation
----------

	npm install --save ng-geolocator

or

	bower install --save ng-geolocator

Getting started
---------------

See the demo folder for a useful example. The following has just the
basics to get you started.

```js
// Add ngGeolocator as a dependency to your module
angular.module('yourModule', ['ngGeolocator']);

// Asynchronously load the Google Maps API (into an object with the
// specified map-canvas id) and ask the user's bowser to share the
// user's location. If both of those things have been approved
// and have happened, the promise will be resolved with a Locator object.
// The create method also takes optionally a Google Maps API key that
// will, if provided, be used to load the API.
var locator;
ngGeolocator.create('map-canvas').then(function(_locator_) {
	// Let's just store the locator for now
	locator = _locator_;
}, function(message) {
	// Something went wrong
	handleError(message);
});

// Now, when the user notifies you (possibly via a confirmation button,
// as done in the demo) that they have specified their location by
// dragging the marker to where they think they are, you can call the
// following to get their location's coordinates:
var location = locator.getLocation();
doSomethingWith(location.lat, location.lng);
```

Demo !
------

Clone this repo, run `npm install` and then start the demo server with
`grunt demo` and go to [http://localhost:8000](http://localhost:8000).
