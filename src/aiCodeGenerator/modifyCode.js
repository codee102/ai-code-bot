import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askAIToModifyCode(issueDescription, projectFiles) {
  const messages = [
    {
      role: "system",
      content:
        "You are an expert software engineer. Modify only necessary parts, keep style consistent.",
    },
    {
      role: "user",
      content: `Here are some project files:\n\n${projectFiles
        .map((f) => `File: ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
        .join("\n\n")}`,
    },
    {
      role: "user",
      content: `Given the above project, solve this issue:\n${issueDescription}\nReturn updated file(s) and explain changes.`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}
