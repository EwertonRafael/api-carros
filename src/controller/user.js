const pool = require('../conection/bdConection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    if (!email || !senha) {
      return res.status(400).json("Email e senha  não podem ser nulos");
    }
    const { rows } = await pool.query("INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING *", [email, senhaCriptografada]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json("Erro no servidor");
  }
}

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (usuario.rowCount < 1) {
      return res.status(404).json("Senha ou usuario inválido");
    }
    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)
    if(!senhaValida) {
      return res.status(401).json("Senha ou usuario inválido");
    }
    const token = jwt.sign({ id: usuario.rows[0].id, email: usuario.rows[0].email }, process.env.SECRET, { expiresIn: '8h' });
    const { senha: _, ...usuarioLogado} = usuario.rows[0];
    res.status(200).json({usuario: usuarioLogado, token});
  } catch (error) {
    res.status(500).json("Erro no servidor");
  }
}


module.exports = { cadastrarUsuario, login }