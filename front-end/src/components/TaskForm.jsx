import { Button, DatePicker, Input, Modal, SelectPicker } from "rsuite";
import { useTaskContext } from "../context/TaskContext";
const TaskForm = ({ onTaskUpdated }) => {
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

  // ...existing code...
  // Funções para usar data local (evita problema com toISOString/UTC)
  const formatDateLocal = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseDateString = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const today = formatDateLocal(new Date());

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
      if (onTaskUpdated) onTaskUpdated();
    } else {
      await addTask(payload);
      if (onTaskUpdated) onTaskUpdated();
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
        className="calendar-sidebar"
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
        <DatePicker
          value={form.dueDate ? parseDateString(form.dueDate) : null}
          onChange={(date) => {
            setForm({
              ...form,
              dueDate: date ? formatDateLocal(date) : "",
            });
          }}
          format="dd/MM/yyyy"
          placeholder="Selecione a data"
          style={{ marginBottom: 12, width: "100%" }}
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
