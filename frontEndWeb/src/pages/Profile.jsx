import api from "../api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useState("")

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
      } catch (error) {
        alert("Error ao carregar perfil!")
        navigate("/login")
      }
    }

    fetchUser();
  }, [])

  async function handleProfile() {
    if (window.confirm("tem certeza que deseja deletar sua conta?")) {
      await api.delete("/auth/delete");
      localStorage.removeItem("token");
      navigate("/register")
    }
  }

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <>
          <P><strong>Nome:</strong>{user.nome}</P>
          <P><strong>Email:</strong>{user.email}</P>
          <button>Editar Perfil</button>
          <button onClick={handleDelte}>Excluir Conta</button>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  )
}
