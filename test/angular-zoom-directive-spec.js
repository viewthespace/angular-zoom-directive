describe('angular-zoom-directive', function(){
  var expect = chai.expect;
  var $compile, $timeout, $scope, $document, body, container, transcludedScope, eleTarget;
  
  beforeEach(module('open-vts'))

  beforeEach(function(){

    inject(function(_$compile_, _$rootScope_, _$document_, _$timeout_) {
      $compile = _$compile_;
      $scope = _$rootScope_;
      $document = _$document_;
      $timeout = _$timeout_;
      body = angular.element(_$document_[0].body)
    });

  });

  beforeEach(function(){
    container = angular.element('<div></div>');
    eleZoomDirective = angular.element(
      '<div ovts-zoom-controls=\'{ target: "#target", minWidth: 80, minHeight: 100, maxWidth: 700, maxHeight: 2000 }\'>' +
        '<div id="controlTarget"></div>' +
      '</div>'
    );
    eleTarget = angular.element('<div style="width: 300px; height: 1000px; background-color: gray;" id="target"/>');
    body.append(container);
    container.append(eleTarget);
    container.append(eleZoomDirective);
    $compile(eleZoomDirective)($scope);
    $timeout.flush();
    transcludedScope = angular.element(eleZoomDirective[0].querySelector('#controlTarget')).scope();
  });

  afterEach(function(){
    container.empty();
  });

  describe('zoom.in', function(){

    
    it('scales target upwards', function() {
      transcludedScope.zoom.in();
      transcludedScope.$digest();
      var transformStyle = eleTarget[0].style.transform;
      var step = parseFloat(transformStyle.substring(transformStyle.indexOf('(') + 1, transformStyle.indexOf(',')));
      expect(step).to.be.closeTo(2, 0.01);
    });

  });

  describe('zoom.out', function(){
    
    it('scales target downwards', function() {
      transcludedScope.zoom.out();
      transcludedScope.$digest();
      var transformStyle = eleTarget[0].style.transform;
      var step = parseFloat(transformStyle.substring(transformStyle.indexOf('(') + 1, transformStyle.indexOf(',')));
      expect(step).to.be.closeTo(0.64, 0.01);
    });

  });

  describe('zoom.isMaxedIn', function(){

    it('returns true when at lowest scale', function() {
      transcludedScope.zoom.in();
      transcludedScope.$digest();
      expect(transcludedScope.zoom.isMaxedIn()).to.be.true
    });

    it('returns false when not lowest scale', function() {
      transcludedScope.zoom.out();
      transcludedScope.$digest();
      expect(transcludedScope.zoom.isMaxedIn()).to.be.false
    });

  });

  describe('zoom.isMaxedout', function(){

    it('returns true when at hightest scale', function() {
      transcludedScope.zoom.out();
      transcludedScope.zoom.out();
      transcludedScope.zoom.out();
      transcludedScope.$digest();
      expect(transcludedScope.zoom.isMaxedOut()).to.be.true
    });

    it('returns false when not highest scale', function() {
      transcludedScope.zoom.in();
      transcludedScope.$digest();
      expect(transcludedScope.zoom.isMaxedOut()).to.be.false
    });

  });
 
});
