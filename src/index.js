const express = require("express");
const rotaFundamentos = require("./RotaFundamentos");
const rotaPrime = require("./RotaPrimeiroProjeto");

const app = express();

app.use(express.json());
app.use('/fundamentos', rotaFundamentos);
app.use('/prime', rotaPrime);

app.listen(3333);