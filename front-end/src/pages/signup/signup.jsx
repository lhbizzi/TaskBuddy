import React, { useState } from "react";
import { Input } from "rsuite";
import "../login/login.css";
import { register } from "../../utils/service";
import { errorMessage, successMessage } from "../../utils/notifications";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState();
  const [sobrenome, setSobrenome] = useState();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [showSenha, setShowSenha] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const data = await register(name, sobrenome, email, senha);
      if (data.success) {
        successMessage("Login realizado com sucesso!");
        navigate("/home");
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Input
            placeholder="Senha"
            className="input"
            type={showSenha ? "text" : "password"}
            value={senha}
            onChange={setSenha}
            style={{ width: "100%" }}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowSenha((prev) => !prev)}
            style={{
              marginLeft: "-25px",
              marginTop: "7px",
              padding: "0",
              border: "none",
              background: "none",
            }}
          >
            {showSenha ? (
              <FaEye className="eye-icon" />
            ) : (
              <FaEyeSlash className="eye-icon" />
            )}
          </button>
        </div>
        <button
          className="button"
          onClick={() => {
            handleSignup();
          }}
        >
          Registrar
        </button>
        <p>
          Já possui uma conta?
          <button className="button_cad" onClick={() => navigate("/")}>
            Conecte-se
          </button>
        </p>
      </div>
    </>
  );
};

export default Signup;
