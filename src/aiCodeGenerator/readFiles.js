import fs from "fs";
import path from "path";

export function readProjectFiles(directory, fileList = []) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readProjectFiles(filePath, fileList);
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      const content = fs.readFileSync(filePath, "utf-8");
      fileList.push({ path: filePath, content });
    }
  });

  return fileList;
}
