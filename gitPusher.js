const { exec } = require('child_process');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

// Correct local file path within the repository
const filePath = path.resolve(__dirname, 'databaseSQLite/schedulerData.db');
const commitMessage = 'Auto-commit for database';
const username = 'danypro5555';
const token = process.env.GIT_TOKEN; // Ensure the variable name matches your .env file
const remoteRepo = `https://${username}:${token}@github.com/danypro5555/OFCAS-webapp.git`; // Correct remote URL
const branchName = 'main'; // Define your branch name
/*
// Function to execute a command and return a promise
const execCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error: ${error.message}`);
      }
      if (stderr) {
        return reject(`Stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

// Function to configure Git, commit, and push changes
async function commitAndPush() {
  try {
    // Verify Git installation
    try {
      await execCommand(`git --version`);
    } catch (err) {
      // Install Git if not present
      console.log('Git is not installed, installing Git...');
      await execCommand(`apt-get update && apt-get install -y git`);
    }

    await execCommand(`git config user.email "danypro5555@gmail.com"`);
    await execCommand(`git config user.name "danypro5555"`);

    // Initialize the repository only if not already initialized
    try {
      await execCommand(`git rev-parse --is-inside-work-tree`);
    } catch {
      await execCommand(`git init`);
    }

    // Check if remote 'origin' exists and add if not
    const remotes = await execCommand(`git remote -v`);
    console.log(remotes);
    if (!remotes.includes('origin')) {
      await execCommand(`git remote add origin ${remoteRepo}`); // Only add remote if it doesn't exist
    }

    // Pull the latest changes before making any commits
    await execCommand(`git pull origin ${branchName}`);

    // Force add the file to ensure it's staged
    await execCommand(`git add ${filePath}`);

    // Print the diff of the file
    const diff = await execCommand(`git diff ${filePath}`);
    console.log(`Diff for ${filePath}:`, diff);

    // Check if there are changes to commit
    const status = await execCommand(`git status --porcelain`);
    console.log('Status after adding file:', status);
    if (!status.includes(filePath)) {
      console.log('No changes to commit');
      return;
    }

    const commitResult = await execCommand(`git commit -m "${commitMessage}"`);
    console.log(commitResult);

    // Push the changes to the remote repository
    const pushResult = await execCommand(`git push origin ${branchName}`);
    console.log(pushResult);

    console.log('File committed and pushed successfully');

    // Verify the commit
    const log = await execCommand(`git log -1`);
    console.log('Latest commit:', log);

  } catch (err) {
    console.error('Failed to commit and push:', err);
  }
}

*/
function commitAndPush(){
console.log("Working");
}

// Export the function if you need to use it elsewhere
module.exports = { commitAndPush };
