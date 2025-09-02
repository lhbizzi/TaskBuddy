const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getTaskAdvice(task, deadline) {
  let prompt = `Tenho a seguinte tarefa: "${task}".`;
  if (deadline) {
    prompt += ` Preciso concluí-la até o dia ${deadline}.`;
  }
  prompt +=
    " Me ajude a montar um plano para completar essa tarefa, considerando o prazo.";

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Você é um assistente que ajuda a organizar tarefas.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = { getTaskAdvice };
