"use strict";

/*We need to manually start angular as we need to
wait for the google charting libs to be ready*/  
google.setOnLoadCallback(function () {  
    angular.bootstrap(document.body, ['my-app']);
});
google.load('visualization', '1', {packages: ['corechart']});


var myApp = myApp || angular.module("my-app",["google-chart"]);

myApp.controller("IndexCtrl",function($scope){  

    $scope.data2 = {};
    $scope.data2.dataTable = new google.visualization.DataTable();
    $scope.data2.dataTable.addColumn("string","Name")
    $scope.data2.dataTable.addColumn("number","Qty")
    $scope.data2.dataTable.addRow(["Test",1]);
    $scope.data2.dataTable.addRow(["Test2",2]);
    $scope.data2.dataTable.addRow(["Test3",3]);

});