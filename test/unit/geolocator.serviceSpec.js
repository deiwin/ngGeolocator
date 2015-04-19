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
      $window.google = {
        maps: {
          LatLng: jasmine.createSpy('maps.LatLng'),
          InfoWindow: jasmine.createSpy('maps.InfoWindow'),
        },
      };
    }));

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
        });
      });
    });
  });
});
