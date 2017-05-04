"use strict";

var cs194proj = angular.module('cs194proj', []);

cs194proj.config(['$compileProvider',
  function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  }
]);

cs194proj.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.main = {};
    $scope.main.title = 'cs194proj';

    $scope.selectorList = [];

    $scope.warningMessage = '';
    $scope.showScript = false;
    $scope.showSavedRows = false;

   $scope.listItems = [{
	    action: '',
	    selector: '',
	    url: '',
  	}];

    $scope.savedRowsArray = [
    {
      name: "subset 1",
      values: [{ action: 'navigate to url',
        selector: '',
        url: 'www.google.com',
      }, 
      { action: 'click',
        selector: 'example selector 1',
        url: '',
      }]
    },
    {
      name: "subset 2",
      values: [{ action: 'navigate to url',
        selector: '',
        url: 'www.amazon.com',
      }, 
      { action: 'exists',
        selector: 'example selector 2',
        url: '',
      },
      { action: 'click',
        selector: 'example selector 3',
        url: '',
      }]
    }];

    console.log($scope.savedRowsArray);

    $scope.generateMessage = 'generate script';

    $scope.show = false;

  	$scope.add = function(listItem) {  
      if (listItem.action == undefined) listItem.action = '';
      if (listItem.selector == undefined) listItem.selector = '';
      if (listItem.url == undefined) listItem.url = '';

      if ($scope.selectorList.length == 0 && listItem.action != 'navigate to url') {
        $scope.warningMessage = 'You must navigate to a website before you can run any tests!';

        listItem.action = '';
        listItem.selector = '';
        listItem.url = '';
      }
      else if (listItem.action == 'navigate to url' && listItem.url == '') {
        $scope.warningMessage = 'You must input a value for the URL!';
      }
      else if (listItem.action != 'navigate to url' && listItem.selector == '') {
        $scope.warningMessage = 'You must input a value for the selector!';
      }
      else {
        var index = $scope.listItems.indexOf(listItem);
        $scope.listItems.splice(index, 1);
        $scope.selectorList.push(angular.copy(listItem));
        $scope.warningMessage = '';

        $scope.show = !$scope.show;

        listItem.action = '';
        listItem.selector = '';
        listItem.url = '';
      }
  	}

    $scope.generate = function() {
      if ($scope.selectorList.length == 0) {
        $scope.warningMessage = 'Your script will be empty!';
      }
      else {
	var actions = new Array();
	for (var i = 0; i < $scope.selectorList.length; i++) {
	  var item = $scope.selectorList[i];
	  actions.push(item)
	}

	var JSONObj = {
	  "browser_type": "firefox",
	  "actions": actions
	}

	$http.post('/generate',JSON.stringify(JSONObj)).then(
	  function(data, status, headers, config){
	    $scope.generatedScript = data.data;
	  }, function(data, status, headers, config){
	    console.log(data);
	  });

	$scope.showScript = true; 
        $scope.warningMessage = '';
        $scope.generateMessage = 're-generate script';
      }
      console.log($scope.selectorList);
    }

    $scope.clear = function() {
      $scope.showScript = false;
      $scope.selectorList = [];
      $scope.generateMessage = 'generate script';
    }

    $scope.savedRows = function() {
      $scope.showSavedRows = !$scope.showSavedRows;
      console.log($scope.savedRowsArray);
    }

    var content = 'lorem ipsum';
    var blob = new Blob([ content ], { type : 'text/plain' });
    $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
}]);