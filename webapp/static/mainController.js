"use strict";

var cs194proj = angular.module('cs194proj', ['ngDragDrop']);

cs194proj.config(['$compileProvider',
  function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  }
]);

cs194proj.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.main = {};
    $scope.main.title = 'cs194proj';

    $scope.selectorList = [];
    $scope.selectorListCopy = [];

    $scope.warningMessage = '';
    $scope.showScript = false;
    $scope.showSavedRows = false;

    $scope.dragging = false;

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
      values: [{ action: 'click',
        selector: 'this should give an error if chosen first',
        url: '',
      }, 
      { action: 'click',
        selector: 'example selector 2',
        url: '',
      }]
    },
    {
      name: "subset 3",
      values: [{ action: 'navigate to url',
        selector: '',
        url: 'www.amazon.com',
      }, 
      { action: 'exists',
        selector: 'example selector 3',
        url: '',
      },
      { action: 'click',
        selector: 'example selector 4',
        url: '',
      }]
    }];

    console.log($scope.savedRowsArray);

    $scope.generateMessage = 'generate script';

    $scope.show = false;

  	$scope.add = function(listItem) {  
      //set appropriate things to ''
      if (listItem.action == 'navigate to url') {
        listItem.selector = '';
      }
      if (listItem.action == 'exists' || listItem.action == 'does not exist' || listItem.action == 'click') {
        listItem.url = '';
      }

      if ($scope.selectorList.length == 0 && listItem.action != 'navigate to url') {
        $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
      }
      else if (listItem.action == 'navigate to url' && listItem.url == '') {
        $scope.warningMessage = 'You must input a value for the URL!';
      }
      else if (listItem.action != 'navigate to url' && listItem.selector == '') {
        $scope.warningMessage = 'You must input a value for the selector!';
      }
      else {
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
	  "browser_type": "Firefox",
	  "actions": actions
	}

	$http.post('/generate',JSON.stringify(JSONObj)).then(
	  function(data, status, headers, config){
	    $scope.generatedScript = data.data;
	    var blob = new Blob([ $scope.generatedScript ], { type : 'text/plain' });
	    $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	  }, function(data, status, headers, config){
	    console.log(data);
	  });

	$scope.showScript = true; 
      $scope.showSavedRows = false;
      $scope.warningMessage = '';
      $scope.generateMessage = 're-generate script';
      }
      console.log($scope.selectorList);
    }

    $scope.clear = function() {
      $scope.showSavedRows = false;
      $scope.showScript = false;
      $scope.selectorList = [];
      $scope.generateMessage = 'generate script';
    }

    $scope.savedRows = function() {
      $scope.show = false;
      $scope.showSavedRows = !$scope.showSavedRows;
    }

    $scope.addSnippet = function(name) {
      for (var i in $scope.savedRowsArray) {
        if ($scope.savedRowsArray[i].name == name) {
          for (var j in $scope.savedRowsArray[i].values) {
            var copy = angular.copy($scope.savedRowsArray[i].values[j]);
            if ($scope.selectorList.length == 0 && copy.action != 'navigate to url') {
              $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
            }
            else {
              $scope.selectorList.push(copy);
              $scope.warningMessage = '';
            }
          }
        }
      }
    }

    $scope.addAnotherRow = function() {
      $scope.show = !$scope.show; 
      $scope.warningMessage = ''; 
      $scope.showSavedRows = false;
    }

    $scope.remove = function(index) {
      if (index == 0 && $scope.selectorList.length > 1) {
        if ($scope.selectorList[1].action != 'navigate to url') {
          $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
        }
      }
      else {
        $scope.selectorList.splice(index, 1);
        console.log("removing");
      }
    }

    $scope.dismiss = function() {
      console.log("dismissing");
      $scope.warningMessage = '';
    }

    $scope.randomName = "first.py";

    $scope.changeName = function() {
      var random = '';
      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
      for(var i=0; i < 10; i++) {
        random += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      console.log(random);
      random += '.py';
      console.log(random);
      $scope.randomName = random;
    }

    $scope.dropCallback = function() {
      console.log("dropped");
      if ($scope.selectorList[0].action != "navigate to url") {
        console.log("OBJECTION");
        $scope.selectorList = $scope.selectorListCopy;
        $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
      }
      else $scope.warningMessage = "";
    };

    $scope.startCallback = function() {
      console.log("saving current order");
      $scope.selectorListCopy = angular.copy($scope.selectorList);
    }
}]);