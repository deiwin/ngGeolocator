describe('ngGeolocator', function() {
  'use strict';
  beforeEach(module('ngGeolocator'));

  describe('service', function() {
    var service, $window, $rootScope;
    beforeEach(inject(function(ngGeolocator, _$window_, _$rootScope_) {
      service = ngGeolocator;
      $window = _$window_;
      $rootScope = _$rootScope_;
      $window.document.body.appendChild = jasmine.createSpy('appendChild');
      $window.document.getElementById = jasmine.createSpy('getElementById');
      $window.google = {
        maps: {
          Map: jasmine.createSpy('maps.Map').and.returnValue({
            setCenter: jasmine.createSpy('maps.Map.setCenter'),
          }),
          LatLng: jasmine.createSpy('maps.LatLng'),
          InfoWindow: jasmine.createSpy('maps.InfoWindow').and.returnValue({
            setMap: jasmine.createSpy('maps.InfoWindow.setMap'),
          }),
        },
      };
    }));

    function callMapsCallback() {
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

        it('should include the key, if added', function() {
          service.create('', 'a-test-key');
          expect(appendChild.calls.first().args[0].src).toMatch('key=a-test-key');
        });

        describe('with API initialized', function() {
          var locatorPromise;
          beforeEach(function() {
            locatorPromise = service.create('canvas-id');
            callMapsCallback();
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
              $rootScope.$apply();

              expect($window.google.maps.InfoWindow).toHaveBeenCalled();
              expect(setMap).toHaveBeenCalledWith(map);
              expect(setCenter).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
