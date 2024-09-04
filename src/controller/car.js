const pool = require('../conection/bdConection');
const listar = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM carros")
    return res.status(200).json(rows)
  } catch (error) {
    console.log(error);

    return res.status(500).json("Erro no servidor");
  }
};
const listarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM carros WHERE id = $1", [id]);
    console.log(rows);
    
    if (rows.length < 1) {
      return res.status(404).json("carro nao encontrado");
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Erro no servidor");
  }
};
const cadastrar = async (req, res) => {
  try {
    const { modelo, marca, ano_do_carro } = req.body;

    const carros = await pool.query("INSERT INTO carros (modelo, marca, ano_do_carro) VALUES ($1, $2, $3) RETURNING *", [modelo, marca, ano_do_carro]);
    
    return res.status(200).json(carros.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Erro no servidor");
  }
};
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelo, marca, ano_do_carro } = req.body;
    const { rows } = await pool.query("SELECT * FROM carros WHERE id = $1", [id]);
    if (rows.length < 1) {
      return res.status(404).json("Carro não encontrado");
    }
    await pool.query("UPDATE carros SET modelo=$1, marca=$2, ano_do_carro=$3 WHERE id = $4", [modelo, marca, ano_do_carro, id]);
    return res.status(200).json("atualizado")
  } catch (error) {
    return res.status(500).json("Erro no servidor");
  }
};
const deletar = async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query("SELECT * FROM carros WHERE id = $1", [id]);
    if (rows.length < 1) {
      return res.status(404).json("Carro não encontrado");
    }
    await pool.query("DELETE FROM carros WHERE id = $1", [id]);
    return res.status(204).json()
  } catch (error) {
    return res.status(500).json("Erro no servidor");
  }
};

module.exports = {
  listar,
  listarPorId,
  cadastrar,
  atualizar,
  deletar
}