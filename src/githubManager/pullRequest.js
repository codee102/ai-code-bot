import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function createPullRequest(branchName, title, body) {
  const [owner, repo] = process.env.GITHUB_REPO.split("/");

  await octokit.pulls.create({
    owner,
    repo,
    title,
    head: branchName,
    base: "main",
    body,
  });
}
