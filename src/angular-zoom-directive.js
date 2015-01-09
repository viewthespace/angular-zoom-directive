app = angular.module('open-vts', [])

app.directive('ovtsZoomControls', function( $window, $document, $timeout ){

  return {

    restrict: 'A',

    replace: true,

    transclude: true,

    template: '<div class="ovts-zoom-controls"></div>',

    scope: {},

    controllerAs: 'zoom',

    controller: function($scope){

      this.in = function() {
        if($scope.currentStep < $scope.stepCnt) {
          $scope.currentStep += 1;
        }
      }

      this.out = function() {
        if($scope.currentStep > 0) {
          $scope.currentStep -= 1;
        }
      }

      this.isMaxedIn = function() {
        return $scope.currentStep == $scope.steps.length - 1;
      }

      this.isMaxedOut = function() {
        return $scope.currentStep == 0;
      }

    },

    link: function($scope, ele, attrs, controller, transclude){

      $timeout(function() {

        var options = $scope.$eval(attrs.ovtsZoomControls) || {};

        var eleControls = ele[0];
        var eleTarget = $document[0].querySelector(options.target);

        var steps = $scope.steps = [];
        var stepCnt = $scope.stepCnt = options.stepCnt || 4;
        var animation = options.animationFn || '.7s ease-out'
        var transformOrigin = options.transformOrigin || 'center top'
        var minHeight = options.minHeight;
        var minWidth = options.minWidth;
        var maxHeight = options.maxHeight;
        var maxWidth = options.maxHeight;
        var min = options.min
        var max = options.max
        var minWidthOffset = options.minWidthOffset || 0
        var minHeightOffset = options.minHeightOffset || 0
        var maxWidthOffset = options.maxWidthOffset || 0
        var maxHeightOffset = options.maxHeightOffset || 0
        var offsetX = options.offsetX || 0

        if(minWidth === 'initial') {
          minWidth = eleTarget.clientWidth;
        }

        if(minHeight === 'initial') {
          minHeight = eleTarget.clientHeight;
        }

        if(minWidth === 'window') {
          minWidth = $window.innerWidth
        }

        if(minHeight === 'window') {
          minHeight = $window.innerHeight
        }

        if(maxWidth === 'initial') {
          maxWidth = eleTarget.clientWidth
        }

        if(maxHeight === 'initial') {
          maxHeight = eleTarget.clientHeight
        }

        if(maxWidth === 'window') {
          maxWidth = $window.innerWidth
        }

        if(maxHeight === 'window') {
          maxHeight = $window.innerHeight
        }

        minHeight += minWidthOffset;
        minHeight += minHeightOffset;
        maxWidth += maxWidthOffset;
        maxHeight += maxHeightOffset;

        transclude($scope, function(nodes){
          angular.element(eleControls).append(nodes);
        })

        $scope.currentStep = calculateSteps();

        applyTransformOrigin(eleTarget, transformOrigin)

        $scope.$watch('currentStep', function(currentStep, oldStep){
          if(currentStep !== oldStep){
            applyAnimation(eleTarget, animation);
          }
          applyTransform(eleTarget, steps[currentStep]);
        });

        function calculateSteps(){
          var width = eleTarget.clientWidth;
          var height = eleTarget.clientHeight;
          var minWidthScale =  minWidth / width || -Infinity;
          var minHeightScale =  minHeight / height || -Infinity;
          var maxWidthScale =  maxWidth / width || Infinity;
          var maxHeightScale =  maxHeight / height || Infinity;
          var minScale = Math.max(minWidthScale, minHeightScale);
          var maxScale = Math.min(maxWidthScale, maxHeightScale);
          var minLog = Math.log(minScale);
          var maxLog = Math.log(maxScale);


          if(minScale > 1 || maxScale < 1) {

            steps.push(1)

          }else{

            var initalStep = Math.round(x(0));

            for (var i = 0; i <= stepCnt; i++) {
              var step;
              if (i < initalStep) {
                step = leftY(i);
              }
              else if(i > initalStep) {
                step = rightY(i);
              }
              else {
                step = 0;
              }
              steps.push(Math.pow(Math.E, step));
            }

            function x(y) {
              return stepCnt * (y - minLog) / (maxLog - minLog)
            }

            function leftY(x) {
              return -minLog / initalStep * x + minLog
            }

            function rightY(x) {
              return maxLog * ( x - initalStep ) / (stepCnt - initalStep);
            }

          }
          return steps.indexOf(1);
        };

        function applyTransformOrigin(element, cssValue) {
          element.style.transformOrigin = cssValue;
          element.style.webkitTransformOrigin = cssValue;
          element.style.mozTransformOrigin = cssValue;
          element.style.msTransformOrigin = cssValue;
          return element.style.oTransformOrigin = cssValue;
        };

        function applyTransform (element, value) {
          var cssValue = "scale(" + value + "," + value + ")";
          element.style.transform = cssValue;
          element.style.webkitTransform = cssValue;
          element.style.mozTransform = cssValue;
          element.style.msTransform = cssValue;
          return element.style.oTransform = cssValue;
        };

        function applyAnimation (element, cssValue) {
          element.style.transition = cssValue;
          element.style.webkitTransition = cssValue;
          element.style.mozTransition = cssValue;
          return element.style.oTransition = cssValue;
        };

      });

    }
  }
});
