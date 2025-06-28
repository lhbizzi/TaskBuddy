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
          style={{ width: "600px", marginBottom: "20px" }}
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
