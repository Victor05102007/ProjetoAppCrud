import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("")
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const navigate = useState("")

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", { nome, email, senha });
      alert(res.data.nessage)
      navigate("/login");
    } catch (eror) {
      alert("Erro ao se registrar", error)
    }

  }

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Nome" type="text" value={nome} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}
