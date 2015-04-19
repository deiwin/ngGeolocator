describe('ngGeolocator', function() {
  'use strict';
  beforeEach(module('ngGeolocator'));

  describe('service', function() {
    var service, $window;
    beforeEach(inject(function(ngGeolocator, _$window_) {
      service = ngGeolocator;
      $window = _$window_;
      $window.document.body.appendChild = jasmine.createSpy('appendChild');
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

        it ('should include the key, if added', function() {
          service.create('', 'a-test-key');
          expect(appendChild.calls.first().args[0].src).toMatch('key=a-test-key');
        });
      });
    });
  });
});
