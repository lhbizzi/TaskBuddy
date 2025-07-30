import React from "react";
import "./login.css";
import { Input } from "rsuite";

const Login = () => {
  return (
    <>
      <div className="container">
        <img
          src="/src/assets/logo_nome.png"
          alt="logo"
          className="logo" // Add back the className if you removed it
        />
        <Input placeholder="Email" className="input" />
        <Input placeholder="Senha" className="input" />
        <button
          className="button"
          onClick={() => {
            window.location.href = "/home";
          }}
        >
          Entrar
        </button>
        <p>
          Não possui uma conta?
          <button className="button_cad">Cadastre-se</button>
        </p>
      </div>
    </>
  );
};

export default Login;
