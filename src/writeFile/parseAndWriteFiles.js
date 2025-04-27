import fs from "fs";
import path from "path";

// Helper function to sanitize the AI-generated file path
function cleanPath(filePath) {
  const projectRoot = process.cwd(); // Get the project root path
  console.log(`Project Root: ${projectRoot}`); // Log the project root

  if (filePath.startsWith(projectRoot)) {
    const clean = filePath.slice(projectRoot.length + 1); // Remove the project root part
    console.log(`Sanitized Path (absolute to relative): ${clean}`);
    return clean;
  }

  console.log(`Path is already relative: ${filePath.trim()}`);
  return filePath.trim();
}

export function parseAndWriteFiles(aiResponse) {
  // Split the response correctly by the marker (Updated File or New File)
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

      // Match the path and content correctly
      const match = filePathLine.match(
        /(.+)\n```(?:javascript)?\n([\s\S]+?)```/,
      );

      if (match) {
        let relativePath = match[1].trim(); // The file path
        const fileContent = match[2]; // The file content

        // Sanitize the path to ensure it's relative to the project root
        relativePath = cleanPath(relativePath);

        // Now join the sanitized relative path with the project root
        const fullPath = path.join(process.cwd(), relativePath);

        // Log the full path being created
        console.log(`Full Path: ${fullPath}`);

        // Get the directory name from the full path
        const dirName = path.dirname(fullPath);
        console.log(`Directory Name: ${dirName}`);

        // Create folders if they don't exist
        if (!fs.existsSync(dirName)) {
          console.log(`Creating directory: ${dirName}`);
          fs.mkdirSync(dirName, { recursive: true });
        } else {
          console.log(`Directory already exists: ${dirName}`);
        }

        // Write the file content to the correct file path
        fs.writeFileSync(fullPath, fileContent, "utf8");
        console.log(`✅ Wrote file: ${relativePath}`);
      }
    }
  }
}
