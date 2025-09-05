const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTaskAdvice(task, deadline) {
  let prompt = `Você é um especialista no assunto da tarefa a seguir e está atuando como assistente em um sistema de gestão de tarefas. Sua missão é ajudar o usuário a organizar e executar a tarefa da melhor forma possível.`;
  prompt += `\nTarefa: "${task}".`;
  if (deadline) {
    prompt += ` Precisa ser concluída até o dia ${deadline}.`;
  }
  prompt += `\nMonte um plano de ação detalhado, passo a passo, para que o usuário consiga realizar essa tarefa com sucesso, considerando o prazo e as melhores práticas do tema.`;
  prompt += `\nResponda APENAS com um JSON no seguinte formato: {\n  \"dica1\":\"[dica1]\",\n  \"dica2\":\"[dica2]\",\n  ... até dica10\n}`;
  prompt += `\nCada dica deve ser um passo objetivo, claro e prático, sem repetições, e que realmente ajude o usuário a avançar na execução da tarefa.`;
  prompt += `\nNÃO inclua datas, prazos ou referências de tempo em nenhuma dica. Apenas o passo a passo, sem mencionar datas.`;

  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });
  const result = await model.generateContent(prompt);
  const content = result.response.text();

  // Tenta extrair JSON da resposta
  let dicas = {};
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      dicas = JSON.parse(match[0]);
    } else {
      dicas = { dica1: content };
    }
  } catch (e) {
    dicas = { dica1: content };
  }
  return dicas;
}

module.exports = { getTaskAdvice };
