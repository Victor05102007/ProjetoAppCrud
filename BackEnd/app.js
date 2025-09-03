const express = require("express");

//CORS --> permite que nosso backend aceite requisições vinda de outras origens
const cors = require("cors");

//dotenv --> gerencia as variaveis de ampiente em um arquivo .env
const dotenv = require("dotenv");

const mysql = require("mysql2/promise");

const bcrypt = require("bcrypt");


const PORT = 3001;
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

//middleware
/*
await axios.get("http://localhost:3001/auth/profile", {
header: { Authorization: `Bearer ${token}`},
})
*/

function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido!" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido!" })
    }

    req.user = user;
    next();
  })
}


app.post("/auth/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email])
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado!" })
    }


    const senha_hash = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO users( nome, email, senha) VALUES (?,?,?)",
      [nome, email, senha_hash]
    );

    res.status(201).json({ message: " Usuário criado com sucesso!" })



  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error ao registrar usuario!" })
  }

});

//Rota: LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    if (rows.length === 0) {
      return res.status(400).json({ error: " Usuario não encontrado!" })
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({ message: "Login bem sucedido!", token })


  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Error ao fazer login!" })
  }
})

// Rota: PERFIL
app.get("/auth/login", async (req, res) => {

  try {
    const [rows] = await pool.query("SELECT nome, email FROM users WHERE id = ?", [req.user.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado. " })
    }

    res.status(200).json({ user: rows[0] });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error ao buscar dados do usuário!" })
  }
})

//Rota: ATUALIZAR
app.put("/auth/update", async (req, res) => {

  try {
    const { nome, email } = req.body;

    if (!nome && !email) {
      return res.status(400).json({ error: " Informe nome ou email para atualizar" })
    }

    await pool.query(
      "UPDATE users SET nome = ?, email = ? WHERE id =?", [nome, email, req.user.id]
    )

    res.json({ message: " Dados atualizados com sucesso!" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao atualizar usuário!" })
  }

});

async function conexaoBd() {
  try {
    const conn = await pool.getConnection();
    console.log("Conexão com MYSQL bem sucedida!")
    conn.release();
  } catch (error) {
    console.log(`Error: ${error}`)
  }
}

conexaoBd();

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
