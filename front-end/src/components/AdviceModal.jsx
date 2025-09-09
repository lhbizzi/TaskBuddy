import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal } from "rsuite";

const AdviceModal = ({
  open,
  onClose,
  advice,
  adviceSteps,
  tasks,
  onAdviceStepsChange,
  titleTask,
}) => {
  const [localAdviceSteps, setLocalAdviceSteps] = useState([]);

  useEffect(() => {
    setLocalAdviceSteps(adviceSteps);
  }, [adviceSteps, open]);

  // Remove a linha do array localAdviceSteps e notifica o pai
  const handleRemove = (idx) => {
    setLocalAdviceSteps((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (onAdviceStepsChange) onAdviceStepsChange(updated);
      return updated;
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Conselho da IA - {titleTask}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {localAdviceSteps.length > 0 ? (
          <div style={{ display: "grid", gap: "8px" }}>
            {localAdviceSteps.map((dica, idx) => {
              const exists = tasks.some(
                (t) =>
                  t.title &&
                  t.title.trim().toLowerCase() === dica.trim().toLowerCase()
              );
              return (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={idx}
                >
                  <div>
                    <button onClick={() => handleRemove(idx)}>
                      <RiDeleteBin6Line className="delete-icon" />
                    </button>
                  </div>
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
};

export default AdviceModal;
