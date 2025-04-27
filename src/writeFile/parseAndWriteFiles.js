import fs from "fs";
import path from "path";

export function parseAndWriteFiles(aiResponse) {
  // Split the response by the markers, but make sure not to split on file paths
  const fileSections = aiResponse
    .split(/(Updated File:|New File:)/g)
    .filter(Boolean);

  // Iterate through the file sections and handle each one
  for (let i = 0; i < fileSections.length; i++) {
    const section = fileSections[i];

    if (
      section.startsWith("Updated File:") ||
      section.startsWith("New File:")
    ) {
      const filePathLine = fileSections[i + 1];

      // Update the regex to capture full file paths without breaking them by space
      const match = filePathLine.match(
        /(.+)\n```(?:javascript)?\n([\s\S]+?)```/,
      );

      if (match) {
        const relativePath = match[1].trim(); // Extract the full relative path
        const fileContent = match[2]; // Extract the file content

        // Sanitize path handling: Ensure we're joining relative paths correctly with the project root
        const fullPath = path.join(process.cwd(), relativePath);

        // Get the directory name for the path
        const dirName = path.dirname(fullPath);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
          console.log(`✅ Created folder: ${dirName}`);
        }

        // Write the file content to the specified path
        fs.writeFileSync(fullPath, fileContent, "utf8");
        console.log(`✅ Wrote file: ${relativePath}`);
      }
    }
  }
}
