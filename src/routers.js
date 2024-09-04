const express = require('express');
const { listar, listarPorId, cadastrar, atualizar, deletar } = require('./controller/car');
const { cadastrarUsuario, login } = require('./controller/user');
const verificarUsuarioLogado = require('./middleware/middleware');
const routers = express.Router();


routers.post('/usuario', cadastrarUsuario)
routers.post('/login', login)

routers.use(verificarUsuarioLogado)

routers.get('/listar', listar)
routers.get('/detalhar/:id', listarPorId)
routers.post('/cadastrar/carro', cadastrar)
routers.put('/atualizar/:id', atualizar)
routers.delete('/deletar/:id', deletar)

module.exports = routers;