
var fs = require('fs');
var parse = require('csv-parse');
var moment = require('moment');
var Promise = require('promise');
var Q = require('q');


var Firebase = require('firebase');
var dataRef = new Firebase('https://itdashboard.firebaseio.com/ambev/volpi/');
var promises = [];


var promise = lerArquivo();

var promise2 = promise.then(outraMsg, console.error)

function lerArquivo() {
    var parser = parse({delimiter: ';'}, function(err, data){
    
        for(j=0;j<data.length;j++){
            
            console.log('reg: ' + j + ' - ' + data[j][1]);
        }
        
        Q.all(promises).then(function(){ 
            // do things after your inner functions run
            console.log('agora terminou');
        });
        
    });
    
    fs.createReadStream(__dirname+'/volpi_2015FULL.csv').pipe(parser);
    
};

function outraMsg() {
    console.log('aaaaa');
};
//process.exit(0);





