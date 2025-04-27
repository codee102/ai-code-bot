import fs from "fs";
import path from "path";

export function parseAndWriteFiles(aiChanges) {
  const fileBlocks = aiChanges.split(/(?:Updated|New) File:/).slice(1); // Split into file sections

  fileBlocks.forEach((block) => {
    const [filePathLine, ...rest] = block.trim().split("\n");
    const filePath = filePathLine.trim();

    const codeMatch = rest.join("\n").match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (!codeMatch) {
      console.warn(`⚠️ No code block found for ${filePath}`);
      return;
    }

    const codeContent = codeMatch[1];

    // Ensure directory exists
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, codeContent, "utf8");
    console.log(`✅ Updated: ${filePath}`);
  });
}
