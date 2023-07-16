const core = require("@actions/core");
const github = require("@actions/github");

async function main(_core, _github) {
  try {
    const token = _core.getInput("github-token", { required: true });
    const packageName = _core.getInput("package-name");
    const namespace = _core.getInput("namespace");
    const repository = _core.getInput("repository");
    const octokit = _github.getOctokit(token);

    const accountType = namespace ? "users" : "orgs";
    const [owner, repo] = repository.split("/");
    const _package = packageName || repo;
    console.log("input data: ", token, packageName, namespace, repository);
    const getUrl = `GET /${accountType}/${owner}/packages/container/${_package}`;
    const { data: metadata } = await octokit.request(getUrl);
    console.log("metadata=", metadata);
    _core.setOutput("package-metadata", JSON.stringify(metadata));
  } catch (error) {
    _core.setFailed(error.message);
  }
}

main(core, github);
module.exports = { main };
