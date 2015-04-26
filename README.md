ngGeolocator
======================

[![Build Status](https://travis-ci.org/deiwin/ngGeolocator.png)](https://travis-ci.org/deiwin/ngGeolocator)
[![Coverage Status](https://coveralls.io/repos/deiwin/ngGeolocator/badge.png?branch=master)](https://coveralls.io/r/deiwin/ngGeolocator?branch=master)
[![devDependency Status](https://david-dm.org/deiwin/ngGeolocator/dev-status.svg)](https://david-dm.org/deiwin/ngGeolocator#info=devDependencies)

Let the user tell you where they are with the aid of HTML5 Geolocation API and Google Maps.

A live demo: http://deiwin.github.io/ngGeolocator/

This project used [ChadKillingsworth/geolocation-marker](https://github.com/ChadKillingsworth/geolocation-marker) as a starting point.

# Installation

	npm install --save ng-geolocator

or

	bower install --save ng-geolocator

# Getting started

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

# Docs
## Classes
<dl>
<dt><a href="#Locator">Locator</a></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#create">create(canvasID, [key])</a> ⇒ <code><a href="#Locator">Promise.&lt;Locator&gt;</a></code></dt>
<dd><p>create will initialize google maps, if it isn&#39;t already initialized, and
will then draw a map on the specified canvasID. Once the user has
accepted to share their location, the map will be centered to that location
and a marker will be displayed that the user can move to confirm/specify
their actual location. This marker will then be used to create a new
<a href="#Locator">Locator</a> object which will then be used to resolve the returned promise.</p>
</dd>
</dl>
## Typedefs
<dl>
<dt><a href="#LatLng">LatLng</a> : <code>Object</code></dt>
<dd></dd>
</dl>
<a name="Locator"></a>
## Locator
**Kind**: global class  

* [Locator](#Locator)
  * [new Locator(marker)](#new_Locator_new)
  * [.getLocation()](#Locator#getLocation) ⇒ <code>[LatLng](#LatLng)</code>

<a name="new_Locator_new"></a>
### new Locator(marker)

| Param | Type | Description |
| --- | --- | --- |
| marker | <code>google.maps.Marker</code> | The marker on the map that indicates the user's location |

<a name="Locator#getLocation"></a>
### locator.getLocation() ⇒ <code>[LatLng](#LatLng)</code>
**Kind**: instance method of <code>[Locator](#Locator)</code>  
**Returns**: <code>[LatLng](#LatLng)</code> - The current user's selected position.  
<a name="create"></a>
## create(canvasID, [key]) ⇒ <code>[Promise.&lt;Locator&gt;](#Locator)</code>
create will initialize google maps, if it isn't already initialized, and
will then draw a map on the specified canvasID. Once the user has
accepted to share their location, the map will be centered to that location
and a marker will be displayed that the user can move to confirm/specify
their actual location. This marker will then be used to create a new
[Locator](#Locator) object which will then be used to resolve the returned promise.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| canvasID | <code>string</code> | The elemt ID of the canvas to load the map onto. |
| [key] | <code>string</code> | Google Maps API key to be used for initializing the API. |

<a name="LatLng"></a>
## LatLng : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lat | <code>number</code> | The latitude. |
| lng | <code>number</code> | The longitude. |

# Demo !

Clone this repo, run `npm install` and then start the demo server with
`grunt demo` and go to [http://localhost:8000](http://localhost:8000).
