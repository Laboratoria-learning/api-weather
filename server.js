const express=require('express');
 var app= express() 
 const server = app.listen(3000,encender);  
 function encender(){
     console.log('servidor encendido');
 }

 app.use(express.static('public'));