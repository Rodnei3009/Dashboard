var fs      = require('fs');
var parse   = require('csv-parse');
var moment  = require('moment');

var totalLinhas     = 0;

var finalArray      = {};
var arrayMeses      = {};
var arrayDias       = {};

var Firebase    = require('firebase');
var dataRef     = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');

var parser = parse({delimiter: ';'}, function (err, data) {
    
    totalLinhas = data.length;  
    
    if (err) {
        console.log(err);
    }
    
    arrayMeses = groupByMonth(data);
    
    //=======================
    for(j=0;j<data.length;j++){

        updateVolAbertos(data[j][2]);
        
        updateVolEncerrados(data[j][4]);
        
        updateVolPrevistos(data[j][8]);
        
        updateVolNoPrazo(data[j][8], data[j][5]);
        
        updateVolReaberto(data[j][8], data[j][6]);
        
        //SLA = total c. vecto no mes - vencidos (abertos e já fechados - sempre olhando prev de vecto) / total c. vecto no mes   
    }
    
    updateSLA();

    gravaDadosMensais();
    
    gravaDadosDia(data);
    
    //=============PROCESSA DADOS DIÁRIOS===============
    
});

fs.createReadStream(__dirname+'/volpi_2015FULL.csv').pipe(parser);

function gravaDadosMensais (abertura){
    
    var totalLinhas = arrayMeses.length;
    var registro    = {};
    //var cont        = 0;
    
    for (h=0;h<arrayMeses.length;h++){
        
        registro = {abertos:    arrayMeses[h].abertos, 
                    encerrados: arrayMeses[h].encerrados, 
                    previstos:  arrayMeses[h].previstos, 
                    no_prazo:   arrayMeses[h].no_prazo, 
                    reabertos:  arrayMeses[h].reabertos, 
                    sla:        arrayMeses[h].sla};
                
        dataRef.child(arrayMeses[h].mes).set(registro, function (erro){
            if(erro){
                console.log ('Ocorreu um erro...' + erro);
            } else {
                //console.log ('cont '+ cont);                        
                //cont = cont + 1;
                //if (cont === totalLinhas) {
                    //console.log ('saindo....');
                    //process.exit(0);
                //}
            }
        });    
        
    }
    
}

//==========================PROCESSA DADOS MENSAIS===================================
function updateVolAbertos (abertura){
    for (h=0;h<arrayMeses.length;h++){
        if (arrayMeses[h].mes === abertura.substring(0,6)){
            arrayMeses[h].abertos = arrayMeses[h].abertos + 1;
        }
    }
}

function updateVolEncerrados (encerramento){
    for (h=0;h<arrayMeses.length;h++){
        if (arrayMeses[h].mes === encerramento.substring(0,6)){
            arrayMeses[h].encerrados = arrayMeses[h].encerrados + 1;
        }
    }
}

function updateVolPrevistos (previsao){
    for (h=0;h<arrayMeses.length;h++){
        if (arrayMeses[h].mes === previsao.substring(0,6)){
            arrayMeses[h].previstos = arrayMeses[h].previstos + 1;
        }
    }
}

function updateVolNoPrazo (previsao, no_prazo){
    for (h=0;h<arrayMeses.length;h++){
        if (arrayMeses[h].mes === previsao.substring(0,6)){
            arrayMeses[h].no_prazo = Number(arrayMeses[h].no_prazo) + Number(no_prazo);
        }
    }
}

function updateVolReaberto (previsao, reaberto){
    for (h=0;h<arrayMeses.length;h++){
        if (arrayMeses[h].mes === previsao.substring(0,6)){
            arrayMeses[h].reabertos = Number(arrayMeses[h].reabertos) + Number(reaberto);
        }
    }
}

function updateSLA (){
    for (h=0;h<arrayMeses.length;h++){
        
        arrayMeses[h].sla = Number(arrayMeses[h].no_prazo) / Number(arrayMeses[h].previstos) * 100;
    }
}

function groupByMonth(data) {
    var result = [];
    var encontrou = 0;
    
    for	(i = 0; i < data.length; i++) {
        if(i === 0){
            result.push({mes: data[i][0], abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla: 0});
            //console.log('primeiro ' + result[i]);
        } else {
            encontrou = 0;
            for	(j = 0; j < result.length; j++) {
                if(data[i][0] != result[j].mes) {
                    //result.push(data[i][0]);
                    encontrou = 0;
                } else {
                    encontrou = 1;
                    j = result.length;
                }
            }
            if(encontrou === 0){
                result.push({mes: data[i][0], abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla: 0});
            }
        }            
    }     
    //console.log('result ...' + result.length);
    result.sort();
    return result;
};
//==========================PROCESSA DADOS MENSAIS===================================

//==========================PROCESSA DADOS DIARIOS===================================


function gravaDadosDia (data) {
    
    for(i=0;i<data.length;i++){
        
        mes             = data[i][0]; 
        chamado         = data[i][1];
        abertura        = data[i][2];
        categoria       = data[i][3];
        encerramento    = data[i][4];
        no_prazo        = data[i][5];
        reaberto        = data[i][6];
        sistema         = data[i][7];
        vcto            = data[i][8];
        
        var cont        = 0;
        
        registro = {abertura: abertura, categoria: categoria, encerramento: encerramento, no_prazo: Number(no_prazo), reaberto: Number(reaberto), sistema: sistema, vcto:vcto};
        
        //console.log('gravando mês: ' + mes + ' chamado: ' + chamado + ' registro: ' + registro.abertura);
        
        dataRef.child(mes).child(chamado).set(registro, function (erro){
            if(erro){
                console.log ('Ocorreu um erro...' + erro);
                
                //cont = cont + 1;
                //if (cont === totalLinhas) {
                //    process.exit(1);
                //}
            } else {
                console.log ('cont '+ cont);                        
                cont = cont + 1;
                if (cont === totalLinhas) {
                    console.log ('saindo....');
                    process.exit(0);
                }
            }
        });
        
        console.log(i);
        mes             = "";
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

//==========================PROCESSA DADOS DIARIOS===================================


function filtraArray(coluna, filtro, data) {
    var result = [];
    for	(i = 0; i < data.length; i++) {
        if(data[i][coluna] === filtro){
            result.push(data[i]);
        }            
    }
    return result;
};

function consolidaDadosDia(data) {
    var result = [];
    var encontrou = 0;
    
    for	(i = 0; i < data.length; i++) {
        //console.log('registros mês...' + data[i][0] + ' - ' + data.length);
        
        var dia = 'd' + data[i][2].substring(0,8);
        
        if(i === 0){
            result.push({dia: dia, abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla: 0});
        } else {
            encontrou = 0;
            for	(j = 0; j < result.length; j++) {
                if(dia != result[j].dia) {
                    encontrou = 0;
                } else {
                    encontrou = 1;
                    j = result.length;
                }
            }
            if(encontrou === 0){
                result.push({dia: dia, abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla: 0});
            }
        }            
        //console.log(result);
    }     
    
    result.sort();
    return result;
};
