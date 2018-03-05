var express = require('express');
var app = express();

app.get('/',function(req,res) {
	res.send("Hello World! IntegrApp Back-End Deployed!");
});

app.listen(process.env.PORT || 8080,function(){
	console.log("listening on 8080");
});
