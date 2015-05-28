describe('ngGeolocator', function() {
  'use strict';
  var provider;
  beforeEach(module('ngGeolocator', function(ngGeolocatorProvider) {
    provider = ngGeolocatorProvider;
  }));

  describe('service', function() {
    var service, $window, $rootScope, $timeout;
    beforeEach(inject(function(ngGeolocator, _$window_, _$rootScope_, _$timeout_) {
      service = ngGeolocator;
      $window = _$window_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      $window.document.body.appendChild = jasmine.createSpy('appendChild');
      $window.document.getElementById = jasmine.createSpy('getElementById');
      $window.navigator.geolocation = {
        getCurrentPosition: jasmine.createSpy('getCurrentPosition'),
      };
      delete $window.google;
    }));

    function loadMockMapsAPI() {
      inject(function() {
        $window.google = {
          maps: {
            Map: jasmine.createSpy('maps.Map').and.returnValue({
              setCenter: jasmine.createSpy('maps.Map.setCenter'),
            }),
            LatLng: jasmine.createSpy('maps.LatLng'),
            Size: jasmine.createSpy('maps.Size'),
            Point: jasmine.createSpy('maps.Point'),
            InfoWindow: jasmine.createSpy('maps.InfoWindow').and.returnValue({
              setMap: jasmine.createSpy('maps.InfoWindow.setMap'),
            }),
            Marker: jasmine.createSpy('maps.Marker').and.returnValue({
              setMap: jasmine.createSpy('maps.Marker.setMap'),
            }),
            Circle: jasmine.createSpy('maps.Circle').and.returnValue({
              setMap: jasmine.createSpy('maps.Circle.setMap'),
            }),
          },
        };
      });
    }

    function callMapsCallback() {
      loadMockMapsAPI();
      var callback = /callback=([^&]*)/.exec($window.document.body.appendChild.calls.first().args[0].src)[1];
      $window[callback]();
    }

    describe('create', function() {
      describe('loading the Google Maps API', function() {
        var appendChild;
        beforeEach(function() {
          appendChild = $window.document.body.appendChild;
        });

        it('add the google maps API script to body', function() {
          service.create();
          expect(appendChild).toHaveBeenCalled();
          expect(appendChild.calls.first().args[0].src).toMatch('maps.googleapis.com/maps/api/js');
        });

        it('should not include the API key if none configured', function() {
          service.create('');
          expect(appendChild.calls.first().args[0].src).not.toMatch('key=');
        });

        describe('with API key configured', function() {
          beforeEach(inject(function($injector) {
            provider.setGoogleMapsAPIKey('a-test-key');
            service = $injector.invoke(provider.$get);
          }));

          it('should include the configured key', function() {
            service.create('');
            expect(appendChild.calls.first().args[0].src).toMatch('key=a-test-key');
          });
        });

        describe('with google maps API loaded by someone other than this service', function() {
          beforeEach(function() {
            loadMockMapsAPI();
          });

          it('should\'nt append another async loading script on create', function() {
            service.create();
            expect(appendChild).not.toHaveBeenCalled();
          });
        });

        describe('with API initialized', function() {
          var locatorPromise;
          beforeEach(function() {
            locatorPromise = service.create('canvas-id');
            callMapsCallback();
          });

          it('should\'nt append another async loading script on create', function() {
            appendChild.calls.reset();
            service.create();
            expect(appendChild).not.toHaveBeenCalled();
          });

          it('should create the map on the specified canvas', function() {
            var mockElement = 'mockElement';
            $window.document.getElementById.and.returnValue(mockElement);

            $rootScope.$apply();

            expect($window.document.getElementById).toHaveBeenCalledWith('canvas-id');
            expect($window.google.maps.Map).toHaveBeenCalled();
            var args = $window.google.maps.Map.calls.first().args;
            expect(args[0]).toBe(mockElement);
            expect(args[1].zoom).toBeDefined();
          });

          describe('with map options extension object configured', function() {
            beforeEach(inject(function($injector) {
              provider.extendMapOptions({
                zoom: 'should-be-a-number-but-isn\'t-for-this-test',
              });
              service = $injector.invoke(provider.$get);
              locatorPromise = service.create('canvas-id');
              callMapsCallback();
            }));

            it('should use the extend options', function() {
              $rootScope.$apply();

              var args = $window.google.maps.Map.calls.first().args;
              expect(args[1].zoom).toBe('should-be-a-number-but-isn\'t-for-this-test');
            });
          });

          describe('with map options extension function configured', function() {
            var testFunc;
            beforeEach(inject(function($injector) {
              provider.extendMapOptions(function(maps) {
                return testFunc(maps);
              });
              service = $injector.invoke(provider.$get);
              locatorPromise = service.create('canvas-id');
              callMapsCallback();
            }));

            it('should use the extend options', function() {
              testFunc = function(maps) {
                expect(maps).toEqual($window.google.maps);
                return {
                  zoom: 'should-be-a-number-but-isn\'t-for-this-test',
                };
              };

              $rootScope.$apply();

              var args = $window.google.maps.Map.calls.first().args;
              expect(args[1].zoom).toBe('should-be-a-number-but-isn\'t-for-this-test');
            });
          });
        });
      });

      describe('getting the user\'s location', function() {
        describe('with no geolocation service available', function() {
          beforeEach(function() {
            delete $window.navigator.geolocation;
          });

          it('should fail', function(done) {
            service.create().catch(function() {
              done();
            });
            $rootScope.$apply();
          }, 500);

          describe('with the map already created', function() {
            itShouldCreateFailureInfoWindow();
          });
        });

        describe('with geolocation service available', function() {
          describe('with timeout reached without user responding', function() {
            it('should fail', function(done) {
              service.create().catch(function() {
                done();
              });
              $timeout.flush();
              $rootScope.$apply();
            }, 500);

            describe('with the map already created', function() {
              itShouldCreateFailureInfoWindow(function() {
                $timeout.flush();
              });
            });
          });
        });

        function itShouldCreateFailureInfoWindow(f) {
          describe('failure InfoWindow', function() {
            var locatorPromise, setMap, map, setCenter;
            beforeEach(function() {
              locatorPromise = service.create();
              callMapsCallback();
              setMap = $window.google.maps.InfoWindow().setMap;
              $window.google.maps.InfoWindow.calls.reset();
              setCenter = jasmine.createSpy('Map.setCenter');
              map = {
                setCenter: setCenter,
              };
              $window.google.maps.Map.and.returnValue(map);
            });

            it('should fail and create an info window on the map', function() {
              if (f) {
                f();
              }
              $rootScope.$apply();

              expect($window.google.maps.InfoWindow).toHaveBeenCalled();
              expect(setMap).toHaveBeenCalledWith(map);
              expect(setCenter).toHaveBeenCalled();
            });
          });
        }
      });

      describe('creating the locator, with maps initialized and location available', function() {
        var locatorPromise, position;
        beforeEach(inject(function($injector) {
          provider.extendStaticCircleOptions({
            testField: 'test-field',
          });
          provider.extendStaticMarkerOptions({
            testField: 'test-static-marker-field',
          });
          provider.extendLocatorMarkerOptions({
            testField: 'test-locator-marker-field',
          });
          service = $injector.invoke(provider.$get);
          locatorPromise = service.create();
          callMapsCallback();
          position = {
            coords: {
              latitude: 10,
              longitude: 20,
              accuracy: 30,
            },
          };
          $window.navigator.geolocation.getCurrentPosition.calls.first().args[0](position);
        }));

        it('should resolve the promise with a locator, that has the location of the marker', function() {
          var locator;
          locatorPromise.then(function(l) {
            locator = l;
          });
          var getPosition = jasmine.createSpy('getPosition').and.returnValue({
            lat: function() {
              return 10;
            },
            lng: function() {
              return 20;
            },
          });
          $window.google.maps.Marker.and.returnValue({
            setMap: $window.google.maps.Marker().setMap,
            getPosition: getPosition,
          });
          $window.google.maps.Marker.calls.reset();

          $rootScope.$apply();

          expect($window.google.maps.LatLng).toHaveBeenCalledWith(10, 20);
          expect($window.google.maps.Circle).toHaveBeenCalled();
          expect($window.google.maps.Circle.calls.first().args[0].radius).toEqual(30);
          expect($window.google.maps.Circle.calls.first().args[0].testField).toEqual('test-field');
          expect($window.google.maps.Marker).toHaveBeenCalled();
          expect($window.google.maps.Marker.calls.count()).toEqual(2);
          expect($window.google.maps.Marker.calls.argsFor(0)[0].testField).toEqual('test-locator-marker-field');
          expect($window.google.maps.Marker.calls.argsFor(1)[0].testField).toEqual('test-static-marker-field');
          var position = locator.getLocation();
          expect(position.lat).toEqual(10);
          expect(position.lng).toEqual(20);
        });
      });
    });
  });
});
