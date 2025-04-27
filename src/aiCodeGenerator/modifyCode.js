import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askAIToModifyCode(issueDescription, projectFiles) {
  const systemPrompt = `You are a senior software engineer. Modify the given project files as per the issue described.`;

  const fileContext = projectFiles
    .map((file) => {
      return `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``;
    })
    .join("\n\n");

  const userPrompt = `
  Here are the project files:
  ${fileContext}

  The issue to solve:
  ${issueDescription}

  Please suggest updated or new files to implement the feature.
  Return code inside triple backticks and specify filenames.
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages,
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}
