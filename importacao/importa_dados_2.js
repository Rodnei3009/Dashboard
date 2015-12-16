
var fs      = require('fs');
var parse   = require('csv-parse');
var moment  = require('moment');

var arrayMeses      = [];
var mesProcessar    = [];
var diaProcessar    = [];
var totalLinhas     = 0;

var mes             = "";
var registro        = {};
var reg_info_mes    = {};

var Firebase    = require('firebase');
var dataRef     = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');
var dataRefresh = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');

var parser = parse({delimiter: ';'}, function(err, data){
    
    totalLinhas = data.length;     
    
    if (err) {
        console.log(err);
    } else {
        
        //======SEPARA OS MESES A SEREM PROCESSADOS===========
        arrayMeses = groupByMonth(data);
        
        //======PARA CADA MES===========
        for(j=0;j<arrayMeses.length;j++){
            
            //==========LIMPA MESES ANTES DE PROCESSAR===================
            var mesRemover = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/' + arrayMeses[j]);
            mesRemover.remove();
            //==========LIMPA MESES ANTES DE PROCESSAR===================
            
            //==========FILTRA SOMENTE O MES A SER PROCESSADO===================
            mesProcessar = filtraArray(0, arrayMeses[j], data);
            
            console.log('Processando mês: ' + arrayMeses[j] + ' com ' + mesProcessar.length + ' registros');
            
            vol_mes         = 0;
            vol_noprazo_mes = 0;
            vol_reabeto_mes = 0;
            sla_mes         = 0;
            
            //====================GRAVA DADOS POR DIA===============================
            for(i=0;i<mesProcessar.length;i++){
                dia             = "d" + mesProcessar[i][2].substring(0,8);
                chamado         = mesProcessar[i][1];
                abertura        = mesProcessar[i][2];
                categoria       = mesProcessar[i][3];
                encerramento    = mesProcessar[i][4];
                no_prazo        = mesProcessar[i][5];
                reaberto        = mesProcessar[i][6];
                sistema         = mesProcessar[i][7];
                vcto            = mesProcessar[i][8];
                                
                cont            = 0;                
                
                vol_mes         = vol_mes + 1;
                vol_noprazo_mes = vol_noprazo_mes + Number(no_prazo);
                vol_reabeto_mes = vol_reabeto_mes + Number(reaberto);
                
                registro = {abertura:       abertura, 
                            categoria:      categoria, 
                            encerramento:   encerramento, 
                            no_prazo:       Number(no_prazo), 
                            reaberto:       Number(reaberto), 
                            sistema:        sistema, 
                            vcto:           vcto};
                
                dataRef.child(arrayMeses[j]).child(dia).child(chamado).set(registro, function (erro){        
                    if(erro){
                        console.log ('Ocorreu um erro...' + erro);
                        process.exit(1);
                    } else {
                        console.log ('registro '+ cont);                        
                        cont = cont + 1;
                        //=====NECESSARIO CONTAR LINHAS PARA FORÇAR SAIDA======
                        if (cont === totalLinhas) {
                            console.log ('Fim processamento....');
                            process.exit(0);
                        }
                    }
                });

                dia             = "";
                chamado         = "";
                abertura        = "";
                categoria       = "";
                encerramento    = "";
                no_prazo        = "";
                reaberto        = "";
                sistema         = "";
                vcto            = "";
                
            }
                        
            //==========GRAVA INFOS CONSOLIDADAS NO MES============
            reg_info_mes = {vol_mes:                vol_mes,
                            vol_reabeto_mes:        vol_reabeto_mes, 
                            sla_mes:                (vol_noprazo_mes / vol_mes) * 100};
            
            dataRef.child(arrayMeses[j]).update(reg_info_mes, function (erro){        

            });
            //====================GRAVA DADOS===============================
            
        }
        //======PARA CADA MES===========
    }
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

function filtraDia(coluna, filtro, data) {
    var result = [];
    //console.log('entrou filtra. coluna=' + coluna + ' filtro=' + filtro);
    for	(i = 0; i < data.length; i++) {
        if(data[i][coluna].substring(0,8) === filtro){
            result.push(data[i]);
            //console.log('registro ' + data[i]);
        }            
    }
    return result;
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


//