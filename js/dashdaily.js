var myApp = angular.module('myApp', []);

myApp.controller('dashitems', function($scope, $interval, dateFilter) {
    
    var valueToPush = new Array();
    
    var registro = function(sistema, volume) {
        this.sistema = sistema;
        this.volume = volume
    };
    
    var dados = [];
    
    
    $scope.dataSourceOri = [];
    $scope.dataSourceTOP5 = [];
    $scope.dataSourceCateg = [];

    
    $scope.xenonPalette = ['#68b828','#7c38bc','#0e62c7','#fcd036','#4fcdfc','#00b19d','#ff6264','#f7aa47'];
        
    $scope.ano_mes_dia = dateFilter(new Date(), 'yyyyMMdd');
    $scope.data_exibir = moment($scope.ano_mes_dia, "YYYYMMDD").format('DD MMMM YYYY');
    
    var hoje = "";
    var qtd_dias = 0;
    
    data = new Date();
    hoje = dateFilter(new Date(), 'yyyyMMdd');
        
    $scope.currentTime = dateFilter(new Date(), 'hh:mm:ss');
    var updateTime = $interval(function() {
        $scope.currentTime = dateFilter(new Date(), 'hh:mm:ss');
    }, 1000);
    
    $scope.carregar = function (dat_carregar) {
        
        $scope.sla=0;
        $scope.vol_acum=0;
        $scope.reabertos=0;
        $scope.vcto_no_dia=0;
        
        var no_prazo = 0;
        var reabertos = 0;
        var vcto_no_dia = 0;
        var sla = 0;

        $scope.carregou = true;
        
        myData = new Firebase("https://itdashboard.firebaseio.com/ambev/volpi/" + dat_carregar.substring(0,6));
        myData.on('value', function(snapshot){
            
            $scope.dataSourceOri = [];
            $scope.dataSourceTOP5 = [];
            $scope.dataSourceCateg = [];
            
            snapshot.forEach(function(childSnapshot) { //para cada chamado

                    if (childSnapshot.child('abertura').val().toString().substring(0,8) === $scope.ano_mes_dia) {
                        
                        $scope.vol_acum = $scope.vol_acum + 1;
                        no_prazo = no_prazo + childSnapshot.child('no_prazo').val();
                        reabertos = reabertos + childSnapshot.child('reaberto').val();
                        if  (childSnapshot.child('vcto').val().toString().substring(0,8) === hoje) {    
                            vcto_no_dia = vcto_no_dia + 1;
                        }                        
                                                
                        $scope.dataSourceOri.push({sistema: childSnapshot.child('sistema').val().toString().substring(0,8), vol: 1});    
                        $scope.dataSourceCateg.push({categoria: childSnapshot.child('categoria').val(), val: 1});
                        
                        sla =  no_prazo / $scope.vol_acum * 100;
                        $scope.sla = sla.toFixed(1);
                        $scope.reabertos = reabertos;
                        $scope.vcto_no_dia = vcto_no_dia;
                    }
                    //$scope.produtos.push({'ID': childSnapshot.key(), 'descricao': childSnapshot.child('descricao').val(), 'categoria': childSnapshot.child('categoria').val(), 'status': childSnapshot.child('status').val()});
            });            
            
            $scope.dataSourceOri = groupBySistema($scope.dataSourceOri);            
            var dChart = $("#bar-5").dxChart("instance");
            dChart.option({ dataSource: $scope.dataSourceOri });
            dChart._render();
            
            $scope.dataSourceCateg = groupByCateg($scope.dataSourceCateg);
            var dChartCateg = $("#bar-10").dxPieChart("instance");
            dChartCateg.option({ dataSource: $scope.dataSourceCateg });
            dChartCateg._render();

            $scope.$apply();
            $scope.carregou = false;

            $scope.data_exibir = moment($scope.ano_mes_dia, "YYYYMMDD").format('DD MMMM YYYY');
        });
    };
    
    $scope.before = function() {
        $scope.ano_mes_dia = moment($scope.ano_mes_dia, "YYYYMMDD").subtract(1, 'day').format('YYYYMMDD');
        $scope.carregar($scope.ano_mes_dia);
    };
    
    $scope.after = function() {
        $scope.ano_mes_dia = moment($scope.ano_mes_dia, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
        $scope.carregar($scope.ano_mes_dia);
    };

    function groupBySistema(data) {
        
        var result = [];
        var cont = 0;
        var encontrou = 0;
        
        for	(i = 0; i < data.length; i++) {
            if(cont === 0){
                result.push({sistema: data[i].sistema, vol: data[i].vol});
                cont = 1;
            } else {
                //$scope.currentTime = data[i].sistema;
                encontrou = 0;
                for	(j = 0; j < result.length; j++) {
                    if(data[i].sistema === result[j].sistema) {
                        result[j].vol = result[j].vol + data[i].vol;
                        //$scope.currentTime = data[i].sistema + ' - ' + result[j].sistema;
                        //return result;
                        encontrou = 1;
                    }
                }
                if(encontrou === 0){
                    result.push({sistema: data[i].sistema, vol: data[i].vol});
                }
            }            
        }     
        result.sort(sortArray);
        return result;
    };
    
    function sortArray(a, b) {
        if(a.length === 0){
            return 0;
        }
        
        if (a.vol === b.vol) {
            return 0;
        }
        else {
            return (a.vol < b.vol) ? -1 : 1;
        }
    };
    
    
    function groupByCateg(data) {
        
        var result = [];
        var cont = 0;
        var encontrou = 0;
        
        for	(i = 0; i < data.length; i++) {
            if(cont === 0){
                result.push({categoria: data[i].categoria, val: data[i].val});
                cont = 1;
            } else {
                //$scope.currentTime = data[i].sistema;
                encontrou = 0;
                for	(j = 0; j < result.length; j++) {
                    if(data[i].categoria === result[j].categoria) {
                        result[j].val = result[j].val + data[i].val;
                        //$scope.currentTime = data[i].sistema + ' - ' + result[j].sistema;
                        //return result;
                        encontrou = 1;
                    }
                }
                if(encontrou === 0){
                    result.push({categoria: data[i].categoria, val: data[i].val});
                }
            }            
        }     
        //result.sort(sortArray);
        return result;
    };
    
    //TOP 5 Sistemas
    //=============================================================================================================    
    $("#bar-5").dxChart({
        rotated: true,
        dataSource: $scope.dataSourceOri.sort(0),
        commonSeriesSettings: {
            argumentField: "sistema",
            type: "stackedbar",
            selectionStyle: {
                hatching: {
                    direction: "left"
                }
            }
        },
        series: [
            { valueField: "vol", name: "Volume", color: "#ffd700" }
        ],
        title: {
            text: "Top 5 sistemas"
        },
        legend: {
            visible: false
        },
        pointClick: function(point) {
            point.isSelected() ? point.clearSelection() : point.select();
        },
        dataPrepareSettings: {
           sortingMethod: true
        }
    });
    //TOP 5 Sistemas
    //=============================================================================================================
    
    $("#bar-10").dxPieChart({
        dataSource: $scope.dataSourceCateg,
        title: "Top 5 Categorias",
        tooltip: {
            enabled: true,
            customizeText: function() { 
                return this.argumentText + "<br/>" + this.valueText;
            }
        },
        size: {
            height: 420
        },
        /*pointClick: function(point) {
            point.showTooltip();
            clearTimeout(timer);
            timer = setTimeout(function() { point.hideTooltip(); }, 2000);
            $("select option:contains(" + point.argument + ")").prop("selected", true);
        },*/
        legend: {
            visible: false
        },  
        series: [{
            type: "doughnut",
            argumentField: "categoria"
            /*label: {
                position: "inside",
                visible: true,
                format: "largeNumber",
                font: {
                    size: 14
                }
            }*/
        }],
        palette: $scope.xenonPalette
    });
    
});
