
var app = angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
app.controller('mainCtrl',function($scope) {

angular.element(document).ready(function () {
$scope.getData();
});
    $scope.data = {
      content : ''
    };
    $scope.data = [];
    ;
    
    $scope.gotData = function(data){
 
      $scope.data = JSON.parse(data);
      $scope.$apply();
      
    };
    
    $scope.leads = [
    { id: 1, type: 'Call' },
    { id: 2, type: 'Cold Call' },
    { id: 3, type: 'Walk-in' },
    { id: 3, type: 'Internet' },
    { id: 3, type: 'Archive' }
  ];
   
   $scope.selectedLeadCall = { id: 1, type: 'Call' };
   $scope.selectedLeadCCal = { id: 2, type: 'Cold Call' };
   $scope.selectedLeadWI = { id: 3, type: 'Walk-in' };
   $scope.selectedLeadIn = { id: 4, type: 'Internet' };
    
    $scope.getData = function(){
      google.script.run.withSuccessHandler($scope.gotData).getContacts();
    };
  
  })
  .config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
});
