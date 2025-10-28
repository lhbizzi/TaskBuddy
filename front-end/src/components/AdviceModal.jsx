import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal, Loader } from "rsuite";
import { saveAdvice } from "../utils/service";
import { successMessage } from "../utils/notifications";

const AdviceModal = ({
  open,
  onClose,
  advice,
  adviceSteps,
  tasks,
  onAdviceStepsChange,
  titleTask,
  taskId,
}) => {
  const [localAdviceSteps, setLocalAdviceSteps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Normalize incoming steps to objects { text, checked }
    const normalized = (adviceSteps || []).map((s) => {
      if (!s) return { text: "", checked: false };
      if (typeof s === "string") return { text: s, checked: false };
      if (typeof s === "object") {
        // support shapes like { text, checked } or { label } or { done }
        return {
          text: s.text || s.label || String(s),
          checked: !!s.checked || !!s.done || false,
        };
      }
      return { text: String(s), checked: false };
    });
    setLocalAdviceSteps(normalized);
  }, [adviceSteps, open]);

  // Remove a linha do array localAdviceSteps e notifica o pai
  const handleRemove = (idx) => {
    setLocalAdviceSteps((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (onAdviceStepsChange)
        // notify parent with the same object shape we're using locally
        onAdviceStepsChange(updated);
      return updated;
    });
  };

  const toggleChecked = (idx) => {
    setLocalAdviceSteps((prev) => {
      const next = prev.map((it, i) =>
        i === idx ? { ...it, checked: !it.checked } : it
      );
      if (onAdviceStepsChange) onAdviceStepsChange(next);
      return next;
    });
  };

  const handleSave = async () => {
    if (!taskId) {
      alert("Nenhuma tarefa selecionada para salvar as dicas.");
      return;
    }
    try {
      setIsSaving(true);
      // salva ou atualiza as dicas para a task
      await saveAdvice({ taskId, steps: localAdviceSteps }).then(() => {
        successMessage("Dicas salvas com sucesso.");
      });
      if (onAdviceStepsChange) onAdviceStepsChange(localAdviceSteps);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Conselho da IA - {titleTask}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {localAdviceSteps.length > 0 ? (
          <div style={{ display: "grid", gap: "8px" }}>
            {localAdviceSteps.map((step, idx) => {
              const text = (step && step.text) || "";
              const exists = tasks.some(
                (t) =>
                  t.title &&
                  t.title.trim().toLowerCase() === text.trim().toLowerCase()
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
                    <span style={{ flex: 1 }}>{text}</span>
                    <input
                      type="checkbox"
                      checked={localAdviceSteps[idx]?.checked || false}
                      onChange={() => toggleChecked(idx)}
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
      <Modal.Footer
        style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{ padding: "6px 12px" }}
          title="Salvar dicas"
        >
          {isSaving ? <Loader size="sm" inline /> : "Salvar"}
        </button>
        <button
          onClick={onClose}
          disabled={isSaving}
          style={{ padding: "6px 12px" }}
        >
          Fechar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdviceModal;
