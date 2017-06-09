"use strict";

var cs194proj = angular.module('cs194proj', ['ngDragDrop', 'ngAnimate'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

cs194proj.config(['$compileProvider',
  function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  }
]);

cs194proj.controller('MainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.addSnippetViewable = false;
    $scope.snippetNamed = false;
    $scope.tempSnippet = {};

    $scope.model = {};

    $scope.main = {};
    $scope.main.title = 'cs194proj';

    $scope.selectorList = [];
    $scope.selectorListCopy = [];

    $scope.snippetInProgress = [];

    $scope.warningMessage = '';
    $scope.showScript = false;
    $scope.showSavedRows = false;

    $scope.dragging = false;

    $scope.firefoxSelected = true;
    $scope.chromeSelected = false;
    $scope.safariSelected = false;

    $scope.snippetMessage = "add snippets";
    $scope.snippetNameMessage = "name snippet"
    $scope.FAQMessage = "show FAQ";

    $scope.warningMessage2 = "";

    $scope.snippetBeingNamed = true;
    $scope.registerDialogueVisible = false;

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
        text: '',
        url: 'www.google.com',
      }, 
      { action: 'click',
        selector: 'example selector 1',
        url: '',
        text: '',
      }]
    },
    {
      name: "subset 2",
      values: [{ action: 'click',
        selector: 'this should give an error if chosen first',
        url: '',
        text: '',
      }, 
      { action: 'click',
        selector: 'example selector 2',
        url: '',
        text: '',
      }]
    },
    {
      name: "subset 3",
      values: [{ action: 'navigate to url',
        selector: '',
        text: '',
        url: 'www.amazon.com',
      }, 
      { action: 'exists',
        selector: 'example selector 3',
        url: '',
        text: '',
      },
      { action: 'enter text',
        selector: 'example selector 4',
        url: '',
        text: 'test text',
      },
      { action: 'click',
        selector: 'example selector 5',
        url: '',
        text: '',
      }]
    }];

    console.log($scope.savedRowsArray);

    $scope.generateMessage = 'generate script';

    $scope.show = false;
    $scope.showAlert = false;

    $scope.toggleAlert = function($timeout) {
      console.log("YEA BISH");
      $scope.showAlert = true;
      
      setTimeout(function() {
          $scope.showAlert = false;
          $scope.$digest();
      }, 2000);

      
    }

    $scope.FAQChange = function() {
      $scope.FAQShown = !$scope.FAQShown; 
      if ($scope.FAQShown == false) $scope.FAQMessage = "show FAQ";
      else $scope.FAQMessage = "hide FAQ";
    }

  	$scope.add = function(listItem) {  
      if (listItem== undefined) {
        $scope.warningMessage = 'You must choose an action!';
      }
      else {
        console.log(listItem.URL);

        if (listItem.action == 'navigate to url') {
          listItem.selector = '';
          listItem.text = '';
        }
        if (listItem.action == 'exists' || listItem.action == 'does not exist' || listItem.action == 'click') {
          listItem.url = '';
          listItem.text = '';
        }
        if (listItem.action == 'enter text') {
          listItem.url = '';
          if (listItem.text == undefined) listItem.text = '';
        }

        if ($scope.selectorList.length == 0 && listItem.action != 'navigate to url') {
          $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
        }
        else if (listItem.action == 'navigate to url' && (listItem.url == '' || listItem.url == undefined)) {
          $scope.warningMessage = 'You must input a value for the URL!';
          console.log("here");
        }
        else if (listItem.action != 'navigate to url' && (listItem.selector == '' || listItem.selector == undefined)) {
          $scope.warningMessage = 'You must input a value for the selector!';
        }
        else if (listItem.action == 'enter text' && (listItem.text == '' || listItem.text == undefined)) {
          $scope.warningMessage = 'You must input a value for the text!';
        }
        else {
          $scope.selectorList.push(angular.copy(listItem));
          $scope.warningMessage = '';

          $scope.show = !$scope.show;

          listItem.action = '';
          listItem.selector = '';
          listItem.url = '';
          listItem.text = '';
        }
      }
  	}

    $scope.addToSnippetList = function() {
      if ($scope.snippetInProgress.length != 0) {
        $scope.tempSnippet.values = angular.copy($scope.snippetInProgress);
        $scope.savedRowsArray.push(angular.copy($scope.tempSnippet));
        $scope.tempSnippet = {};
        $scope.snippetInProgress = [];
        $scope.addSnippetViewable = false;
        $scope.snippetNamed = false;
        $scope.model.currentSnippetName = '';

        document.getElementsByClassName('success-alert')[0].style.visibility = 'hidden';

      }
    }

    //neeaten this. only need 1 of the 2
    $scope.addToSnippet = function(snippetItem) {  
      if (snippetItem == undefined) {
        $scope.warningMessage2 = 'You must choose an action!';
      }
      else {
        if (snippetItem.action == 'navigate to url') {
          snippetItem.selector = '';
          snippetItem.text = '';
        }
        if (snippetItem.action == 'exists' || snippetItem.action == 'does not exist' || snippetItem.action == 'click') {
          snippetItem.url = '';
          snippetItem.text = '';
        }
        if (snippetItem.action == 'enter text') {
          snippetItem.url = '';
          if (snippetItem.text == undefined) snippetItem.text = '';
        }

        if (snippetItem.action == 'navigate to url' && (snippetItem.url == '' || snippetItem.url == undefined)) {
          $scope.warningMessage2 = 'You must input a value for the URL!';
        }
        else if (snippetItem.action != 'navigate to url' && (snippetItem.selector == '' || snippetItem.selector == undefined)) {
          $scope.warningMessage2 = 'You must input a value for the selector!';
        }
        else if (snippetItem.action == 'enter text' && (snippetItem.text == '' || snippetItem.text == undefined)) {
          $scope.warningMessage2 = 'You must input a value for the text!';
        }
        else {
          $scope.snippetInProgress.push(angular.copy(snippetItem));
          $scope.warningMessage2 = '';

          snippetItem.action = '';
          snippetItem.selector = '';
          snippetItem.url = '';
          snippetItem.text = '';
        }
      }
    }

    $scope.nameSnippet = function() {
      if ($scope.model.currentSnippetName == '' || $scope.model.currentSnippetName == undefined) {
        console.log("YEET THIS BITCH EMPTY");
        $scope.warningMessage2 = "you must give your snippet a name!";
      }
      else {
        $scope.tempSnippet.name = angular.copy($scope.model.currentSnippetName);
        $scope.snippetNamed = true;

        $scope.snippetBeingNamed = !$scope.snippetBeingNamed;

        if ($scope.snippetNameMessage == "name snippet") $scope.snippetNameMessage = "rename snippet";
        else $scope.snippetNameMessage = "name snippet";
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
      "browser_types": [],
      "actions": actions
    }  

    if ($scope.firefoxSelected == true) {
      JSONObj.browser_types.push("Firefox");
      console.log("firefox");
    }
    if ($scope.chromeSelected == true) {
      JSONObj.browser_types.push("Chrome");
      console.log("chrome");
    }
    if ($scope.safariSelected == true) {
      JSONObj.browser_types.push("Safari");
      console.log("safari");
    }

    if (JSONObj.browser_types.length == 0) JSONObj.browser_types.push("Firefox");

    console.log(JSONObj);

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
      if ($scope.showSavedRows == true) $scope.snippetMessage = "hide snippets";
      else $scope.snippetMessage = "add snippets";
    }

    $scope.addSnippetToTest = function(name) {
      for (var i in $scope.savedRowsArray) {
        if ($scope.savedRowsArray[i].name == name) {
          for (var j in $scope.savedRowsArray[i].values) {
            var copy = angular.copy($scope.savedRowsArray[i].values[j]);
            if ($scope.selectorList.length == 0 && copy.action != 'navigate to url') {
              $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
            }
            else {
              $scope.toggleAlert(); 
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
      $scope.snippetMessage = "add snippets";
    }

    $scope.remove = function(index) {
      if (index == 0 && $scope.selectorList.length > 1) {
        if ($scope.selectorList[1].action != 'navigate to url') {
          $scope.warningMessage = 'You must navigate to a website before you can run any tests!';
        }
      }
      else {
        $scope.selectorList.splice(index, 1);
      }
    }

    $scope.removeSnippet = function(index) {
      $scope.savedRowsArray.splice(index, 1);
    }

    $scope.removeSnippetRow = function(index) {
        $scope.snippetInProgress.splice(index, 1);
    }

    $scope.dismiss = function() {
      console.log("dismissing");
      $scope.warningMessage = '';
    }

    $scope.dismiss2 = function() {
      console.log("dismissing");
      $scope.warningMessage2 = '';
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