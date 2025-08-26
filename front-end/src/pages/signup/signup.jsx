import React from "react";
import { Input } from "rsuite";
import "../login/login.css";
import { register } from "../../utils/service";

const Signup = () => {
  return (
    <>
      <div className="container">
        <img
          src="/src/assets/logo_nome.png"
          alt="logo"
          className="logo" // Add back the className if you removed it
        />
        <Input placeholder="Nome" className="input" />
        <Input placeholder="Sobrenome" className="input" />
        <Input placeholder="Email" className="input" />
        <Input placeholder="Senha" className="input" />
        <button
          className="button"
          onClick={() => {
            register();
          }}
        >
          Registrar
        </button>
      </div>
    </>
  );
};

export default Signup;
