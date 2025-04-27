import fs from "fs";
import path from "path";

export function parseAndWriteFiles(aiResponse) {
  const fileSections = aiResponse
    .split(/(Updated File:|New File:)/g)
    .filter(Boolean);

  for (let i = 0; i < fileSections.length; i++) {
    const section = fileSections[i];

    if (
      section.startsWith("Updated File:") ||
      section.startsWith("New File:")
    ) {
      const filePathLine = fileSections[i + 1];
      const match = filePathLine.match(
        /(.+)\n```(?:javascript)?\n([\s\S]+?)```/,
      );

      if (match) {
        const relativePath = match[1].trim();
        const fileContent = match[2];

        const fullPath = path.join(process.cwd(), relativePath);
        const dirName = path.dirname(fullPath);

        // 🛠️ Create folders if they don't exist
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
          console.log(`✅ Created folder: ${dirName}`);
        }

        fs.writeFileSync(fullPath, fileContent, "utf8");
        console.log(`✅ Wrote file: ${relativePath}`);
      }
    }
  }
}
