app = angular.module('open-vts', [])

app.directive('ovtsZoomControls', function( $window, $document ){
  
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

      this.toFit = function() {

      }

    },

    link: function($scope, ele, attrs, controller, transclude){
      
      var options = $scope.$eval(attrs.ovtsZoomControls) || {};
      
      var eleControls = ele[0];
      var eleTarget = $document[0].querySelector(options.target);

      var steps = [];
      var stepCnt = $scope.stepCnt = options.stepCnt || 4;
      var minHeight = options.minHeight;
      var minWidth = options.minWidth;
      var maxHeight = options.maxHeight;
      var maxWidth = options.maxHeight;

      if( !minHeight || !minWidth || !maxHeight || !maxWidth ){
        throw minErr('Test')
      }

      transclude($scope, function(nodes){
        angular.element(eleControls).append(nodes);
      })

      $scope.currentStep = calculateSteps();

      applyAnimation(eleTarget, ".7s ease-out")

      $scope.$watch('currentStep', function(currentStep){
        applyTransform(eleTarget, steps[currentStep]);
      });

      function calculateSteps(){
        var width = eleTarget.clientWidth;
        var height = eleTarget.clientHeight;
        var minWidthScale =  minWidth / width;
        var minHeightScale =  minHeight / height;
        var maxWidthScale =  maxWidth / width;
        var maxHeightScale =  maxHeight / height;
        var minScale = Math.max(minWidthScale, minHeightScale);
        var maxScale = Math.min(maxWidthScale, maxHeightScale);
        var minLog = Math.log(minScale);
        var maxLog = Math.log(maxScale);
        
        steps = [];
        var initalStep = Math.round(x(0));
        for (var i = 0; i < stepCnt; i++) {
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

        console.log(steps)
        
        
        function x(y) {
          return ( stepCnt * (y - minLog) ) / (maxLog - minLog)
        }

        function leftY(x) {
          return ( minLog / -initalStep * x ) + minLog
        }

        function rightY(x) {
          return ( maxLog / (stepCnt - initalStep) * x ) + (0 - (initalStep * ( maxLog / (stepCnt - initalStep))  ))
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

      
    }
  }
});
