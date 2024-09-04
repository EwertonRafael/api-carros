const jwt = require('jsonwebtoken');
const verificarUsuarioLogado = (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json("Token ausente")
    }
    const token = authorization.split(' ')[1]

    const tokenUsuario = jwt.verify(token, process.env.SECRET)
    
    if (!tokenUsuario) {
      return res.status(401).json("Token inválido")
    }
    next()
  } catch (error) {
    return res.status(401).json("Token inválido")
  }
}

module.exports = verificarUsuarioLogado