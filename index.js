const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const uniqid = require("uniqid");
//
const app = express();
const PORT = 8008;
//Aplico Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
// Init Array de Compras. (Simulo una Base de datos)
const compras = [
  {
    "id": "Casa",
    "clientId": "1000",
    "products": ["100","300","400","500","600","700","800"],
    "amount": 10000,
    "paymentMethod": "Credit Card"
  }
];
// Defino Rutas, me baso en el modelo REST
app.get("/compras", function (req,res){
  res.status(200).send({'compras':compras});
});
//
app.get("/compras/:id", function (req,res){
  const identificador = req.params.id;
  let comprasIdentificador = undefined;
  compras.forEach(function(compra){
    if(compra.id == identificador){
      comprasIdentificador = compra;
      return res.status(200).json({compra:comprasIdentificador});
    }
  });
  res.status(400).send({"mensaje":"La compra no se pudo encontrar."});
});
//
app.post("/compras", function (req,res){
  if(!req.body || !req.body.clientId || !req.body.products || !req.body.amount || !req.body.paymentMethod){
    return res.status(400).send({"mensaje":"No se puede incorporar la compra."});
  }
  const nuevaCompra = {
    "id":req.body.id,
    "clientId":req.body.clientId,
    "products":req.body.products,
    "amount":req.body.amount,
    "paymentMethod":req.body.paymentMethod
  }
  compras.push(nuevaCompra);
  return res.status(201).send({"compras":nuevaCompra});
});
//
app.put("/compras/:id", function (req,res){
  if(!req.body || !req.body.clientId || !req.body.products || !req.body.amount || !req.body.paymentMethod){
    return res.status(400).send({"mensaje":"No se puede modificar la compra."});
  }
  /*
  const reemplazarCompra = {
    "id":req.body.id,
    "clientId":req.body.clientId,
    "products":req.body.products,
    "amount":req.body.amount,
    "paymentMethod":req.body.paymentMethod
  }
  compras.push(reemplazarCompra);
  return res.status(201).send({"mensaje":reemplazarCompra});
  */
  const pedirID = req.params.id;
  let compra = compras.filter(compra => {
    return compra.id == pedirID;
  })[0];
  const indice = compras.indexOf(compra);
  const llaves = Object.keys(req.body);
  llaves.forEach(llave => {
    compras[llave] = req.body[llave];
  });
  compras[indice] = compra; 
  res.json(compras[indice]);
});
//
app.delete("/compras/:id", function (req,res){
  const ID = req.params.id;
  let indice = null;
  compras.forEach(function(compra,i){
    if(compra.id == ID){
      indice = i;
    }
  });
  if(indice !== null){
    compras.splice(indice,1);
    res.status(200).send({"mensaje":"La compra ha sido retirada."});
  }else{
    res.status(400).send({"mensajes":"La compra no pudo ser encontrada y eliminada."})
  }
});
//FUNCIONES
function irAlSiguienteID(){
  return (compras.reduce((a,b) => { return a.id > b.id? a: b })).id + 1;
};
// Ahora que tengo todo definido y creado, levanto el servicio escuchando peticiones en el puerto
app.listen(PORT,function(){
  console.log(`La Maratón de Guayerd se inició en el puerto: ${PORT}\n\n`);
});