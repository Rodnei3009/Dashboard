var googleChart = googleChart || angular.module("google-chart",[]);

google.setOnLoadCallback(function () {  
    angular.bootstrap(document.body, ['my-app']);
});
google.load('visualization', '1', {packages: ['corechart']});


googleChart.directive("googleChart",function(){  
    return{
        link: function($scope, $elem, $attr){
            var dt = $scope[$attr.ngModel].dataTable;

            var options = {};
            if($scope[$attr.ngModel].title)
                options.title = $scope[$attr.ngModel].title;

            var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
            googleChart.draw(dt,options)
        }
    }
});


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