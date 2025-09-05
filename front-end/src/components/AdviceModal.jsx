import React from "react";
import { Modal } from "rsuite";

const AdviceModal = ({ open, onClose, advice, adviceSteps, tasks }) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>
      <Modal.Title>Conselho da IA</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* Renderiza grid de dicas se houver adviceSteps */}
      {adviceSteps.length > 0 ? (
        <div style={{ display: "grid", gap: "8px" }}>
          {adviceSteps.map((dica, idx) => {
            // Verifica se já existe uma tarefa igual cadastrada
            const exists = tasks.some(
              (t) =>
                t.title &&
                t.title.trim().toLowerCase() === dica.trim().toLowerCase()
            );
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: exists ? "#f8d7da" : "#f4f8fb",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  opacity: exists ? 0.6 : 1,
                }}
              >
                <span style={{ flex: 1 }}>{dica}</span>
                <input
                  type="checkbox"
                  disabled={exists}
                  style={{ marginLeft: 12 }}
                />
                {exists && (
                  <span
                    style={{
                      color: "#c0392b",
                      marginLeft: 8,
                      fontSize: 12,
                    }}
                  >
                    Já cadastrada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>{advice}</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <button onClick={onClose}>Fechar</button>
    </Modal.Footer>
  </Modal>
);

export default AdviceModal;
