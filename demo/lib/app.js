angular.module('geolocator', ['ngGeolocator'])
  .constant('googleMapsAPIKey', 'AIzaSyD25T9lG8fVHB6jq9vQ5L5beXndQMtCtAA')
  .directive('geolocator', ['ngGeolocator', 'googleMapsAPIKey',
    function(ngGeolocator, googleMapsAPIKey) {
      return {
        scope: {},
        link: function($scope, $element, $attrs) {
          var locator;
          // var locatorPromise = ngGeolocator.loadMap('map-canvas', googleMapsAPIKey);
          var locatorPromise = ngGeolocator.loadMap('map-canvas');
          $scope.ready = false;
          $scope.confirmLocation = function() {
            var location = locator.getLocation();
            alert('Confirmed location: '+location.lat+', '+location.lng);
          };
          locatorPromise.then(function(_locator_) {
            locator = _locator_;
            locator.readyPromise.then(function() {
              $scope.ready = true;
            }, function(message) {
              $scope.locatorError = message;
            });
          });
        },
        restrict: 'E',
        templateUrl: 'demo/lib/geolocator.template.html'
      };
    }
  ]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['geolocator']);
});
