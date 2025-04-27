import simpleGit from "simple-git";

const git = simpleGit();

export async function cloneRepo(repoUrl, localPath) {
  await git.clone(repoUrl, localPath);
}

export async function createBranch(branchName) {
  await git.checkoutLocalBranch(branchName);
}

export async function commitAndPushChanges(branchName, commitMessage) {
  await git.add(".");
  await git.commit(commitMessage);
  await git.push("origin", branchName);
}
