import React, { useState } from "react";
import { Input } from "rsuite";
import "../login/login.css";
import { register } from "../../utils/service";
import { errorMessage, successMessage } from "../../utils/notifications";

const Signup = () => {
  const [name, setName] = useState();
  const [sobrenome, setSobrenome] = useState();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();

  const handleSignup = async () => {
    try {
      const data = await register(email, senha);
      if (data.success) {
        successMessage("Login realizado com sucesso!");
        window.location.href = "/home";
      } else {
        errorMessage(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      errorMessage(err.message);
    }
  };
  return (
    <>
      <div className="container">
        <img
          src="/src/assets/logo_nome.png"
          alt="logo"
          className="logo" // Add back the className if you removed it
        />
        <Input
          placeholder="Nome"
          className="input"
          value={name}
          onChange={setName}
        />
        <Input
          placeholder="Sobrenome"
          className="input"
          value={sobrenome}
          onChange={setSobrenome}
        />
        <Input
          placeholder="Email"
          className="input"
          value={email}
          onChange={setEmail}
        />
        <Input
          placeholder="Senha"
          className="input"
          value={senha}
          onChange={setSenha}
        />
        <button
          className="button"
          onClick={() => {
            handleSignup();
          }}
        >
          Registrar
        </button>
      </div>
    </>
  );
};

export default Signup;
