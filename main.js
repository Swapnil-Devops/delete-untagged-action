const core = require('@actions/core');
const { getOctokit } = require('@actions/github');

async function main() {
  try {
    const token = core.getInput('github-token', { required: true });
    const packageName = core.getInput('package-name');
    const namespace = core.getInput('namespace');
    const repository = core.getInput('repository');
    const github = getOctokit(token);

    const accountType = namespace ? 'users' : 'orgs';
    const [owner, repo] = repository.split('/');
    const package = packageName || repo;
    const getUrl = `GET /${accountType}/${owner}/packages/container/${package}`;
    const { data: metadata } = await github.request(getUrl);
    console.log("metadata=",metadata);
    core.setOutput('package-metadata', JSON.stringify(metadata));
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
