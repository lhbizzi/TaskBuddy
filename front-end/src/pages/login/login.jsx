import "./login.css";
import { Input } from "rsuite";
import { useState } from "react";
import { login } from "../../utils/service";
import { errorMessage, successMessage } from "../../utils/notifications";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(email, senha);
      if (data.success) {
        successMessage("Login realizado com sucesso!");
        window.location.href = "/home";
      } else {
        errorMessage(data.message || "Erro ao fazer login");
        setError(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
      errorMessage(err.message || "Erro de conexão com o servidor");
    }
  };

  return (
    <>
      <div className="container">
        <img src="/src/assets/logo_nome.png" alt="logo" className="logo" />
        <Input
          placeholder="Email"
          className="input"
          value={email}
          onChange={setEmail}
        />
        <Input
          placeholder="Senha"
          className="input"
          type="password"
          value={senha}
          onChange={setSenha}
        />
        <button className="button" onClick={handleLogin}>
          Entrar
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Não possui uma conta?
          <button
            className="button_cad"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </>
  );
};

export default Login;
