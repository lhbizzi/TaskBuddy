import { Button, Input, Message, SelectPicker } from "rsuite";
import { useTaskContext } from "../context/TaskContext";
import { useEffect, useState } from "react";

const TaskForm = () => {
  const { form, setForm, addTask, loading, handleChange, editTask } =
    useTaskContext();
  const [editId, setEditId] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.titulo,
      description: form.descricao,
      dueDate: form.dataVencimento || today,
      status: form.status,
    };
    if (editId) {
      await editTask(editId, payload);
      setEditId(null);
    } else {
      await addTask(payload);
    }
    setForm({
      titulo: "",
      descricao: "",
      dataVencimento: today,
      status: "pendente",
    });
  };

  useEffect(() => {
    console.log("Form atualizado:", form);
  }, [form]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          margin: "0 auto",
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <h3 style={{ textAlign: "center" }}>
          {editId ? "Editar Tarefa" : "Nova Tarefa"}
        </h3>
        <Input
          name="titulo"
          value={form.titulo}
          onChange={(value) => setForm({ ...form, titulo: value })}
          placeholder="Título"
          style={{ marginBottom: 12 }}
          required
        />
        <Input
          name="descricao"
          value={form.descricao}
          onChange={(e) => handleChange(e, "descricao")}
          placeholder="Descrição"
          style={{ marginBottom: 12 }}
          required
        />
        <Input
          name="dataVencimento"
          type="date"
          value={form.dataVencimento || today}
          onChange={(value, event) =>
            setForm({ ...form, dataVencimento: event?.target?.value || value })
          }
          style={{ marginBottom: 12 }}
          required
        />
        <SelectPicker
          data={[
            { label: "Pendente", value: "pendente" },
            { label: "Concluída", value: "concluida" },
          ]}
          value={form.status}
          onChange={(value) => setForm({ ...form, status: value })}
          placeholder="Status"
          style={{ marginBottom: 12 }}
          required
        />
        <Button appearance="primary" type="submit" loading={loading} block>
          {editId ? "Salvar" : "Criar Tarefa"}
        </Button>
      </form>
    </>
  );
};

export default TaskForm;
