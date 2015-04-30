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
var yourModule = angular.module('yourModule', ['ngGeolocator']);

// Optionally configure the service to use a Google Maps API Key.
yourModule.config(['ngGeolocatorProvider', function(ngGeolocatorProvider) {
	ngGeolocatorProvider.setGoogleMapsAPIKey('your-api-key-goes-here');
}]);

// Asynchronously load the Google Maps API (into an object with the
// specified map-canvas id) and ask the user's bowser to share the
// user's location. If both of those things have been approved
// and have happened, the promise will be resolved with a Locator object.
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

## Getting fancy

Say you don't like the color I've chosen to use for the accuracy indicator circle.
Here's an easy way to customize it to your liking:

```js
yourModule.config(['ngGeolocatorProvider', function(ngGeolocatorProvider) {
	ngGeolocatorProvider.extendStaticCircleOptions({
		fillColor: 'cc99ff', // Mauve
	});
}]);
```

Custom icons and everything are also possible, but are left as an excercise to the reader.
Please see the docs or the code itself for any questions.

# Docs
<a name="ngGeolocator"></a>
## ngGeolocator : <code>object</code>
**Kind**: global namespace  

* [ngGeolocator](#ngGeolocator) : <code>object</code>
  * [.Locator](#ngGeolocator.Locator)
    * [new Locator(marker)](#new_ngGeolocator.Locator_new)
    * [.getLocation()](#ngGeolocator.Locator#getLocation) ⇒ <code>LatLng</code>
  * [.LocatorService](#ngGeolocator.LocatorService)
    * [.create(canvasID)](#ngGeolocator.LocatorService#create) ⇒ <code>Promise.&lt;Locator&gt;</code>
  * [.LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)
    * [.setGoogleMapsAPIKey(googleMapsAPIKey)](#ngGeolocator.LocatorServiceProvider#setGoogleMapsAPIKey)
    * [.extendMapOptions(extender)](#ngGeolocator.LocatorServiceProvider#extendMapOptions)
    * [.extendStaticMarkerOptions()](#ngGeolocator.LocatorServiceProvider#extendStaticMarkerOptions)
    * [.extendStaticCircleOptions()](#ngGeolocator.LocatorServiceProvider#extendStaticCircleOptions)
    * [.extendLocatorMarkerOptions()](#ngGeolocator.LocatorServiceProvider#extendLocatorMarkerOptions)
  * [.LatLng](#ngGeolocator.LatLng) : <code>Object</code>

<a name="ngGeolocator.Locator"></a>
### ngGeolocator.Locator
**Kind**: static class of <code>[ngGeolocator](#ngGeolocator)</code>  

* [.Locator](#ngGeolocator.Locator)
  * [new Locator(marker)](#new_ngGeolocator.Locator_new)
  * [.getLocation()](#ngGeolocator.Locator#getLocation) ⇒ <code>LatLng</code>

<a name="new_ngGeolocator.Locator_new"></a>
#### new Locator(marker)

| Param | Type | Description |
| --- | --- | --- |
| marker | <code>google.maps.Marker</code> | The marker on the map that indicates the user's location |

<a name="ngGeolocator.Locator#getLocation"></a>
#### locator.getLocation() ⇒ <code>LatLng</code>
**Kind**: instance method of <code>[Locator](#ngGeolocator.Locator)</code>  
**Returns**: <code>LatLng</code> - The current user's selected position.  
<a name="ngGeolocator.LocatorService"></a>
### ngGeolocator.LocatorService
**Kind**: static class of <code>[ngGeolocator](#ngGeolocator)</code>  

* [.LocatorService](#ngGeolocator.LocatorService)
  * [.create(canvasID)](#ngGeolocator.LocatorService#create) ⇒ <code>Promise.&lt;Locator&gt;</code>

<a name="ngGeolocator.LocatorService#create"></a>
#### locatorService.create(canvasID) ⇒ <code>Promise.&lt;Locator&gt;</code>
create will initialize google maps, if it isn't already initialized, and
will then draw a map on the specified canvasID. Once the user has
accepted to share their location, the map will be centered to that location
and a marker will be displayed that the user can move to confirm/specify
their actual location. This marker will then be used to create a new
[Locator](Locator) object which will then be used to resolve the returned promise.

**Kind**: instance method of <code>[LocatorService](#ngGeolocator.LocatorService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| canvasID | <code>string</code> | The elemt ID of the canvas to load the map onto. |

<a name="ngGeolocator.LocatorServiceProvider"></a>
### ngGeolocator.LocatorServiceProvider
**Kind**: static class of <code>[ngGeolocator](#ngGeolocator)</code>  

* [.LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)
  * [.setGoogleMapsAPIKey(googleMapsAPIKey)](#ngGeolocator.LocatorServiceProvider#setGoogleMapsAPIKey)
  * [.extendMapOptions(extender)](#ngGeolocator.LocatorServiceProvider#extendMapOptions)
  * [.extendStaticMarkerOptions()](#ngGeolocator.LocatorServiceProvider#extendStaticMarkerOptions)
  * [.extendStaticCircleOptions()](#ngGeolocator.LocatorServiceProvider#extendStaticCircleOptions)
  * [.extendLocatorMarkerOptions()](#ngGeolocator.LocatorServiceProvider#extendLocatorMarkerOptions)

<a name="ngGeolocator.LocatorServiceProvider#setGoogleMapsAPIKey"></a>
#### locatorServiceProvider.setGoogleMapsAPIKey(googleMapsAPIKey)
Configure the service to use the specified Google Maps API Key.

**Kind**: instance method of <code>[LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)</code>  

| Param | Type |
| --- | --- |
| googleMapsAPIKey | <code>string</code> |

<a name="ngGeolocator.LocatorServiceProvider#extendMapOptions"></a>
#### locatorServiceProvider.extendMapOptions(extender)
The [google.maps.MapOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions)
used to initialize the map will be extended using the provided function or object. If the extender is an object it will
simply be used to extend (using [angular.extend](https://docs.angularjs.org/api/ng/function/angular.extend))
the options object used to initialize the map. If, instead, the extender is a function, it will be called with the API
(<code>google.maps</code>) once Google Maps is loaded. An object used to extend <code>MapOptions</code> is expected as
the return value of the function.

**Kind**: instance method of <code>[LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)</code>  

| Param | Type |
| --- | --- |
| extender | <code>Object</code> &#124; <code>function</code> |

**Example**  
<caption>Using an object</caption>
```js
ngGeolocatorProvider.extendMapOptions({
  zoom: 15,
});
```
**Example**  
<caption>Using a function</caption>
```js
ngGeolocatorProvider.extendMapOptions(function(maps) {
  return {
    center: maps.LatLng(10, 20),
  };
});
```
<a name="ngGeolocator.LocatorServiceProvider#extendStaticMarkerOptions"></a>
#### locatorServiceProvider.extendStaticMarkerOptions()
Extends the
[google.maps.MarkerOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions)
for the static marker.

**Kind**: instance method of <code>[LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)</code>  
**See**: [extendMapOptions](#ngGeolocator.LocatorServiceProvider#extendMapOptions) for more info and examples  
<a name="ngGeolocator.LocatorServiceProvider#extendStaticCircleOptions"></a>
#### locatorServiceProvider.extendStaticCircleOptions()
Extends the
[google.maps.CircleOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#CircleOptions)
for the static circle.

**Kind**: instance method of <code>[LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)</code>  
**See**: [extendMapOptions](#ngGeolocator.LocatorServiceProvider#extendMapOptions) for more info and examples  
<a name="ngGeolocator.LocatorServiceProvider#extendLocatorMarkerOptions"></a>
#### locatorServiceProvider.extendLocatorMarkerOptions()
Extends the
[google.maps.MarkerOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions)
for the locator marker.

**Kind**: instance method of <code>[LocatorServiceProvider](#ngGeolocator.LocatorServiceProvider)</code>  
**See**: [extendMapOptions](#ngGeolocator.LocatorServiceProvider#extendMapOptions) for more info and examples  
<a name="ngGeolocator.LatLng"></a>
### ngGeolocator.LatLng : <code>Object</code>
**Kind**: static typedef of <code>[ngGeolocator](#ngGeolocator)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lat | <code>number</code> | The latitude. |
| lng | <code>number</code> | The longitude. |

# Demo !

Clone this repo, run `npm install` and then start the demo server with
`grunt demo` and go to [http://localhost:8000](http://localhost:8000).
