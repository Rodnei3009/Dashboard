var fs      = require('fs');
var parse   = require('csv-parse');
var moment  = require('moment');

var totalLinhas     = 0;

var finalArray      = {};
var arrayMeses      = {};
var arrayDias       = {};
var data            = {};

var Firebase    = require('firebase');
var dataRef     = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');

var parser = parse({delimiter: ';'}, function (err, data) {
    
    totalLinhas = data.length;  
    
    if (err) {
        console.log(err);
    }
    
    arrayMeses  = groupByMonth(data);
    arrayDias   = groupByDay(data);
    
    //=======================
    for(j=0;j<data.length;j++){

        //=====DADOS MENSAIS==============
        updateVolAbertos(data[j][2]);
        
        updateVolEncerrados(data[j][4]);
        
        updateVolPrevistos(data[j][8]);
        
        updateVolNoPrazo(data[j][8], data[j][5]);
        
        updateVolReaberto(data[j][8], data[j][6]);
        //=====DADOS MENSAIS==============
        
        //=====DADOS DIARIOS==============
        updateVolAbertosDia(data[j][2]);
        
        updateVolEncerradosDia(data[j][4]);
        
        updateVolPrevistosDia(data[j][8]);
        
        updateVolNoPrazoDia(data[j][8], data[j][5]);
        
        updateVolReabertoDia(data[j][8], data[j][6]);
        //=====DADOS DIARIOS==============
        
    }

    updateSLA();
    //updateSLADia(data);

    //console.log(arrayDias);
    //return;

    gravaDadosMensais();
    
    gravaDadosDia(arrayDias);
    
    gravaChamados(data);
    
    //=============PROCESSA DADOS DIÁRIOS===============
    
});

fs.createReadStream(__dirname+'/volpi_2015FULL.csv').pipe(parser);

function gravaDadosMensais (){
    
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

function updateVolAbertosDia (abertura){
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === "d" + abertura.substring(0,8)){
            arrayDias[h].abertos = arrayDias[h].abertos + 1;
        }
    }
}

function updateVolEncerradosDia (encerramento){
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === "d" + encerramento.substring(0,8)){
            arrayDias[h].encerrados = arrayDias[h].encerrados + 1;
        }
    }
}

function updateVolPrevistosDia (previsao){
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === "d" + previsao.substring(0,8)){
            arrayDias[h].previstos = arrayDias[h].previstos + 1;
        }
    }
}

function updateVolNoPrazoDia (previsao, no_prazo){
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === "d" + previsao.substring(0,8)){
            arrayDias[h].no_prazo = Number(arrayDias[h].no_prazo) + Number(no_prazo);
        }
    }
}

function updateVolReabertoDia (previsao, reaberto){
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === "d" + previsao.substring(0,8)){
            arrayDias[h].reabertos = Number(arrayDias[h].reabertos) + Number(reaberto);
        }
    }
}

function updateVolAcum (abertura, abertos_acum, enc_acum, reab_acum, no_prazo_acum) {
    
    for (h=0;h<arrayDias.length;h++){
        if (arrayDias[h].dia === abertura){
            
            arrayDias[h].abertos_acum = abertos_acum;
            arrayDias[h].encerrados_acum = enc_acum;
            arrayDias[h].reab_acum = reab_acum;
            arrayDias[h].no_prazo_acum = no_prazo_acum;
    
        }
    }
}

function updateSLADia (data){
        
    console.log('aqui...' + data.length);
    //return;
    
    var mes                         = "",
        sla_acum_ate_data           = 0,
        abertos_acum_ate_data       = 0,
        enc_acum_ate_data           = 0,
        reab_acum_ate_data          = 0,
        no_prazo_acum_ate_data      = 0;
        
        var mesTemp = {};
    
    for (h=0;h<arrayMeses.length;h++){
    
        sla_acum_ate_data           = 0;
        abertos_acum_ate_data       = 0;
        enc_acum_ate_data           = 0;
        reab_acum_ate_data          = 0;
        no_prazo_acum_ate_data      = 0;
        
        mes = arrayMeses[h].mes;
        
        mesTemp = filtraArray(0, mes, data);
        console.log('mês: ' + mes + ' reistros: ' + mesTemp.length);
        //return;
        
        for (x=0;x<mesTemp.length;x++){

            if (mes === mesTemp[x][0]) {
                
                //abertos_acum_ate_data       = Number(abertos_acum_ate_data) + 1;
                //console.log('para aqui');
                //return;
                
            }
            
            //update acumuluado aqui
            //updateVolAcum (arrayDias[x].dia, abertos_acum_ate_data, enc_acum_ate_data, reab_acum_ate_data, no_prazo_acum_ate_data);
            
            sla_acum_ate_data           = 0;
            abertos_acum_ate_data       = 0;
            enc_acum_ate_data           = 0;
            reab_acum_ate_data          = 0;
            no_prazo_acum_ate_data      = 0;
            
        }
        
        mes                         = "";
        
        //arrayMeses[h].sla = Number(arrayMeses[h].no_prazo) / Number(arrayMeses[h].previstos) * 100;
    }
}

function groupByDay(data) {
    var result = [];
    var encontrou = 0;
    
    for	(i = 0; i < data.length; i++) {
        
        dia             = "d" + data[i][2].substring(0,8); 
        
        if(i === 0){
            result.push({dia: dia, abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla_acum: 0, abertos_acum: 0, encerrados_acum: 0, reab_acum: 0, no_prazo_acum: 0});
            //console.log('primeiro ' + result[i]);
        } else {
            encontrou = 0;
            for	(j = 0; j < result.length; j++) {
                if(dia != result[j].dia) {
                    //result.push(data[i][0]);
                    encontrou = 0;
                } else {
                    encontrou = 1;
                    j = result.length;
                }
            }
            if(encontrou === 0){
                result.push({dia: dia, abertos: 0, encerrados: 0, previstos: 0, no_prazo: 0, reabertos: 0, sla_acum: 0, abertos_acum: 0, encerrados_acum: 0, reab_acum: 0, no_prazo_acum: 0});
            }
        }            
    }     
    //console.log('result ...' + result.length);
    result.sort();
    return result;
};

function gravaDadosDia (data) {

    var totalLinhas = data.length;
    var registro    = {};
    var mes         = "";
    var dia         = "";
    var cont        = 0;
    
    for (h=0;h<data.length;h++){
        
        mes = data[h].dia.substring(1,7);
        dia = data[h].dia,
        
        registro = {abertos:    data[h].abertos, 
                    encerrados: data[h].encerrados, 
                    previstos:  data[h].previstos, 
                    no_prazo:   data[h].no_prazo, 
                    reabertos:  data[h].reabertos};
                
        dataRef.child(mes).child(dia).set(registro, function (erro){
            if(erro){
                console.log ('Ocorreu um erro...' + erro);
            } else {
                //console.log ('cont '+ cont);                        
                //cont = cont + 1;
                //if (cont === totalLinhas) {
                //    console.log ('saindo....');
                //    process.exit(0);
                //}
            }
        });    
        
    }
    
    
};

function gravaChamados (data) {

    var totalLinhas = data.length;
    var registro    = {};
    var mes         = "";
    var dia         = "";
    var cont        = 0;
    
    for (h=0;h<data.length;h++){
        
        
        mes = data[h][2].substring(0,6);
        dia = "d" + data[h][2].substring(0,8);
        chamado = data[h][1];

        registro = {abertura:       data[h][2],
                    categoria:      data[h][3],       
                    encerramento:   data[h][4],
                    no_prazo:       data[h][5],
                    reaberto:       data[h][6],
                    sistema:        data[h][7],
                    vcto:           data[h][8] };
                
        dataRef.child(mes).child(dia).child('chamados').child(chamado).set(registro, function (erro){
            if(erro){
                console.log ('Ocorreu um erro...' + erro);
            } else {
                console.log ('cont '+ cont);                        
                cont = cont + 1;
                if (cont === totalLinhas) {
                    console.log ('saindo....');
                    process.exit(0);
                }
            }
        });    
        
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
