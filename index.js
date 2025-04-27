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
  const issueDescription = "Add a POST endpoint to create a new user";

  const aiChanges = await askAIToModifyCode(issueDescription, projectFiles);
  console.log("AI suggests:\n", aiChanges);

  fs.writeFileSync("app.js", aiChanges); // Modify existing file, or smarter update later

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
