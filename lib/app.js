angular.module('geolocator', ['ngGeolocator'])
  .config(['ngGeolocatorProvider', function(ngGeolocatorProvider) {
    ngGeolocatorProvider.setGoogleMapsAPIKey('AIzaSyD25T9lG8fVHB6jq9vQ5L5beXndQMtCtAA');
  }])
  .directive('geolocator', ['ngGeolocator',
    function(ngGeolocator) {
      return {
        scope: {},
        link: function($scope, $element, $attrs) {
          var locator;
          $scope.ready = false;
          $scope.confirmLocation = function() {
            var location = locator.getLocation();
            alert('Confirmed location: '+location.lat+', '+location.lng);
          };
          ngGeolocator.create('map-canvas').then(function(_locator_) {
            locator = _locator_;
            $scope.ready = true;
          }, function(message) {
            $scope.locatorError = message;
          });
        },
        restrict: 'E',
        templateUrl: 'lib/geolocator.template.html'
      };
    }
  ]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['geolocator']);
});
