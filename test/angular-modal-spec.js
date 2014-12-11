describe('angular-modal', function(){
  var expect = chai.expect;
  var $compile, $scope, body, modalElement;
  
  beforeEach(module('open-vts'))

  beforeEach(function(){
    inject(function(_$compile_, _$rootScope_, _$document_) {
      $compile = _$compile_;
      $scope = _$rootScope_;
      body = angular.element(_$document_[0].body)
    });
  });

  beforeEach(function(){
    modalElement = angular.element('<div ovts-modal="open"><p>Modal Text</p></div>')
    $compile(modalElement)($scope);
    body.append(modalElement);
  });

  it('opens on truthy open binding', function(){
    $scope.open = true;
    $scope.$digest();
    expect(modalElement[0].classList.contains('ovts-modal-active')).to.be.true
  });

  it('closes on falsey open binding', function(){
    $scope.open = false;
    $scope.$digest();
    expect(modalElement[0].classList.contains('ovts-modal-active')).to.be.false
  });  

  it('transcludes dom', function(){
    expect(modalElement.find('p').length).to.equal(1)
  });

});