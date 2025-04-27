import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function createPullRequest(branchName, title, body) {
  //   const [ repo] = process.env.GITHUB_REPO.split("/");
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  await octokit.pulls.create({
    owner,
    repo,
    title,
    head: branchName,
    base: "main",
    body,
  });
}
