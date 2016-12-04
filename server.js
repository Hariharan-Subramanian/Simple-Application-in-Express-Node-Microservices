var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use("/", express.static(__dirname));
app.listen(3000);
console.log("listening seat Tracker By Hariharan");
var fs = require("fs");
app.post('/register', function(req, res) {
    var fileData = {};
    try {
        var stats = fs.lstatSync(__dirname + "/users.json");
        if (stats.isFile()) {
            fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
                fileData = JSON.parse(data);
                //res.end('ok');
                fileData.loginData.push(req.body);
                fs.open(__dirname + "/" + "users.json", "w", function(err, fd) {
                    fs.write(fd, JSON.stringify(fileData), 'utf8', function() {
                        fs.close(fd, function() {
                            console.log('file closed');
                        });
                        res.end('{"status":"00","register":"true"}'); 
                        
                    });
                });
            });
        }
    } catch (e) {
        console.log(e)
    }
});
app.post('/login', function(req, res) {
    try {
        var stats = fs.lstatSync(__dirname + "/users.json");
        var userData=req.body;
        if (stats.isFile()) {
            fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
                var loginInfo=JSON.parse(data);
                for(var i=0;i<loginInfo.loginData.length;i++){
                   if(loginInfo.loginData[i].name==userData.name && loginInfo.loginData[i].password==userData.password){
                      res.end('{"status":"00","login":"true"}');  
                   }
                }
                //res.end('{"status":"01","login":"false"}');               
            });
        }
    } catch (e) {
        console.log(e)
    }
});
app.get('/reservedHistory', function(req, res) {
    try {
        var stats = fs.lstatSync(__dirname + "/reserve.json");
        var userData=req.body;
        if (stats.isFile()) {
            fs.readFile(__dirname + "/" + "reserve.json", 'utf8', function(err, data) {
              console.log(data)
                res.end(data);               
            });
        }
    } catch (e) {
        console.log(e)
    }
});
app.post('/reserve', function(req, res) {
    var fileData = {};
    try {
        var stats = fs.lstatSync(__dirname + "/reserve.json");
        if (stats.isFile()) {
            fs.readFile(__dirname + "/" + "reserve.json", 'utf8', function(err, data) {
                fileData = JSON.parse(data);
                fileData.reservedData.push(req.body);
                fs.open(__dirname + "/" + "reserve.json", "w", function(err, fd) {
                    fs.write(fd, JSON.stringify(fileData), 'utf8', function() {
                        fs.close(fd, function() {
                            console.log('file closed');
                        });
                        res.end('{"status":"00","reserve":"true"}');  
                    });
                });
            });
        }
    } catch (e) {
       res.end('{"status":"01","reserve":"false"}'); 
        console.log(e)
    }
});