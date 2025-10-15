import api from "../api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [user, setUser] = useState(null)
  const navigate = useState("")

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/profile");
        setNome(res.data.nome);
        setEmail(res.data.setEmail);
      } catch (error) {
        alert("Error ao carregar as informações")
      }
    }

    fetchUser();
  }, [])

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const res = await api.put("/auth/update", { email, senha });
      alert("Dados atualizados!");
      navigate("/profile");
    } catch (eror) {
      alert("Erro ao atualizar dados:", error)
    }

  }

  return (
    <div>
      <h2>Editar Profile</h2>

      <form onSubmit={handleLogin}>
        <input placeholder="Nome" type="text" value={senha} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
