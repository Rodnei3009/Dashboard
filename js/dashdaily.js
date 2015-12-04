var myApp = angular.module('myApp', []);

myApp.controller('dashitems', function($scope, $interval, dateFilter) {
                    
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
            //alert(snapshot.numChildren());
            //$scope.vol_acum = snapshot.numChildren(); //total de chamados        
            snapshot.forEach(function(childSnapshot) { //para cada chamado
                    //alert(childSnapshot.child('abertura').val().toString().substring(0,8));
                    if (childSnapshot.child('abertura').val().toString().substring(0,8) === $scope.ano_mes_dia) {
                        $scope.vol_acum = $scope.vol_acum + 1;
                        no_prazo = no_prazo + childSnapshot.child('no_prazo').val();
                        reabertos = reabertos + childSnapshot.child('reaberto').val();
                        if  (childSnapshot.child('vcto').val().toString().substring(0,8) === hoje) {    
                            vcto_no_dia = vcto_no_dia + 1;
                        }
                        sla =  no_prazo / $scope.vol_acum * 100;
                        $scope.sla = sla.toFixed(1);
                        $scope.reabertos = reabertos;
                        $scope.vcto_no_dia = vcto_no_dia;
                    }
                    //$scope.produtos.push({'ID': childSnapshot.key(), 'descricao': childSnapshot.child('descricao').val(), 'categoria': childSnapshot.child('categoria').val(), 'status': childSnapshot.child('status').val()});
            });
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
    
    
});