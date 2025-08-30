// Modelo de Tarefa
class Task {
  constructor(id, title, description, status, dueDate, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.userId = userId;
  }
}

module.exports = Task;
