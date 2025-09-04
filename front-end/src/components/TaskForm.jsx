import { Button, Input, SelectPicker } from "rsuite";
import { useTaskContext } from "../context/TaskContext";
const TaskForm = () => {
  const {
    form,
    setForm,
    addTask,
    loading,
    handleChange,
    editTask,
    editId,
    setEditId,
    initialFormState,
  } = useTaskContext();

  const today = new Date().toISOString().slice(0, 10);
  const handleSubmit = async (e) => {
    console.log("Form enviado:", form);
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || today,
      status: form.status,
    };
    if (editId) {
      await editTask(editId, payload);
      setEditId(false);
    } else {
      await addTask(payload);
    }
    setForm({
      title: "",
      description: "",
      dueDate: today,
      status: "pendente",
    });
  };

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
          name="title"
          value={form.title}
          onChange={(value) => setForm({ ...form, title: value })}
          placeholder="Título"
          style={{ marginBottom: 12 }}
          required
        />
        <Input
          name="description"
          value={form.description}
          onChange={(e) => handleChange(e, "description")}
          placeholder="Descrição"
          style={{ marginBottom: 12 }}
          required
        />
        <Input
          name="dueDate"
          type="date"
          value={form.dueDate || today}
          onChange={(value, event) =>
            setForm({ ...form, dueDate: event?.target?.value || value })
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
          name="status"
          onChange={(value) => setForm({ ...form, status: value })}
          placeholder="Status"
          style={{ marginBottom: 12 }}
          required
        />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button
            appearance="default"
            style={{ marginRight: 8 }}
            onClick={() => {
              setForm(initialFormState);
              setEditId(null);
            }}
          >
            Cancelar
          </Button>
          <Button appearance="primary" type="submit" loading={loading}>
            {editId ? "Salvar Alterações" : "Criar Tarefa"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default TaskForm;
