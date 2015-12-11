
var fs = require('fs');
var parse = require('csv-parse');
var moment = require('moment');
var totalLinhas = 0;
var arrayMeses = [];
var mesProcessar = [];

var mes         = ""
var registro    = "";

var Queue = require('firebase-queue')
var Firebase = require('firebase');
var dataRef = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');
var dataRefresh = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');

var parser = parse({delimiter: ';'}, function(err, data){

    arrayMeses = groupByMonth(data);
    
    console.log('qtd meses: ' + arrayMeses.length);
    
    for(j=0;j<arrayMeses.length;j++){
        
        var mesRemover = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/' + arrayMeses[j]);
        mesRemover.remove();
        
        mesProcessar = filtraArray(0, arrayMeses[j], data);
        
        console.log('Mes processar: ' + arrayMeses[j] + ' registros ' + mesProcessar.length);
        
        gravaDados(arrayMeses[j], mesProcessar);
        
        console.log('Mes: ' + j + ' - ' + arrayMeses[j]);
    }
    
    console.log('terminou');

});

fs.createReadStream(__dirname+'/volpi_2015FULL.csv').pipe(parser);

//dataRefresh.once('child_added', function (snapshot) {
    //s'o est'a aqui para encerrar a batch. precisa estar dentro de um callback function
    //process.exit();
//});


function gravaDados(mes, data) {
    
    console.log('gravando mês: ' + mes + ' com ' + data.length + ' registros');
    
    for(i=0;i<data.length;i++){
        chamado         = data[i][1];
        abertura        = data[i][2];
        categoria       = data[i][3];
        encerramento    = data[i][4];
        no_prazo        = data[i][5];
        reaberto        = data[i][6];
        sistema         = data[i][7];
        vcto            = data[i][8];
        
        registro = {abertura: abertura, categoria: categoria, encerramento: encerramento, no_prazo: Number(no_prazo), reaberto: Number(reaberto), sistema: sistema, vcto:vcto};
        
        //console.log('gravando mês: ' + mes + ' chamado: ' + chamado + ' registro: ' + registro.abertura);
        
        dataRef.child(mes).child(chamado).set(registro, function (erro){

            if(erro){
                console.log ('ocorreu um erro...' + erro);
                //process.exit(1);
                process.stdout.write('X');                
            } else {
                //console.log ('processado com sucesso...');
                //process.exit(0);
                process.stdout.write('j');
            }
            
            //colocar tratamento de erro    
        });
        
        console.log(i);
        
        chamado         = "";
        abertura        = "";
        categoria       = "";
        encerramento    = "";
        no_prazo        = "";
        reaberto        = "";
        sistema         = "";
        vcto            = "";
    }
};

function filtraArray(coluna, filtro, data) {
    var result = [];
    //console.log('entrou filtra. coluna=' + coluna + ' filtro=' + filtro);
    for	(i = 0; i < data.length; i++) {
        if(data[i][coluna] === filtro){
            result.push(data[i]);
            //console.log('registro ' + data[i]);
        }            
    }
    return result;
};


function groupByMonth(data) {

    var result = [];
    var cont = 0;
    var encontrou = 0;
    
    for	(i = 0; i < data.length; i++) {
        if(i === 0){
            result.push(data[i][0]);
            console.log('primeiro ' + result[i]);
        } else {
            encontrou = 0;
            for	(j = 0; j < result.length; j++) {
                if(data[i][0] != result[j]) {
                    //result.push(data[i][0]);
                    encontrou = 0;
                } else {
                    encontrou = 1;
                    j = result.length;
                }
            }
            if(encontrou === 0){
                result.push(data[i][0]);
            }
        }            
    }     
    console.log('result ...' + result.length);
    result.sort();
    return result;
};


