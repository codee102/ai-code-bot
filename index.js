import dotenv from "dotenv";
dotenv.config();

import { readProjectFiles } from "./src/aiCodeGenerator/readFiles.js";
import { askAIToModifyCode } from "./src//aiCodeGenerator/modifyCode.js";
import {
  cloneRepo,
  createBranch,
  commitAndPushChanges,
} from "./src//githubManager/gitOps.js";
import { createPullRequest } from "./src//githubManager/pullRequest.js";
import { parseAndWriteFiles } from "./src/writeFile/parseAndWriteFiles.js"; // <--- new helper

import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

async function main() {
  const repoUrl = process.env.GITHUB_REPO; // <--- New env variable
  const repoName = repoUrl.split("/").pop().replace(".git", ""); // Get repo folder name
  const localPath = path.join(process.cwd(), repoName);

  await cloneRepo(repoUrl, localPath);
  console.log(`✅ Repo cloned to: ${localPath}`);

  process.chdir(localPath);

  const projectFiles = readProjectFiles(localPath);
  const issueDescription = `
  Create a new Express route at POST /users that accepts a JSON body with user data and returns the created user.

  - Create a new controller if necessary.
  - Update existing routes.
  - Handle basic validation (e.g., name and email required).
  - Follow current project structure and coding conventions.
  `;
  const aiChanges = await askAIToModifyCode(issueDescription, projectFiles);
  console.log("AI suggests:\n", aiChanges);

  // fs.writeFileSync("app.js", aiChanges); // Modify existing file, or smarter update later
  parseAndWriteFiles(aiChanges);

  const branchName = `feature/${Date.now()}`;
  await createBranch(branchName);
  await commitAndPushChanges(branchName, "feature: add POST /users endpoint");
  await createPullRequest(
    branchName,
    "Add POST endpoint for users",
    issueDescription,
  );

  console.log("✅ Pull Request created!");
}

main().catch(console.error);
