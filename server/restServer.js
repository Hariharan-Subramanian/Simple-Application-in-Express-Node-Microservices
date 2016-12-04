var express = require('express');
var app = express();
var fs = require("fs");

app.post('/register', function(req, res) {
    var requestData=req.body;
    var stats = fs.lstatSync(__dirname + "/users.json");
    if (stats.isFile()) {
        fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
            data = JSON.parse(data);
           // data["user4"] = user["user4"];
            console.log(data);
            res.end(JSON.stringify(data));
        });
    } else {
        fs.open(__dirname + "/" + "users.json", "a", function (err, fd) {
         fs.write(fd,requestData, 'utf8', function(){
            fs.close(fd, function(){
              console.log('file closed');
            });
         });
      });
    }
});
