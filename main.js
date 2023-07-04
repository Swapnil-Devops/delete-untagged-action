const core = require('@actions/core');
const { getOctokit } = require('@actions/github');

async function main() {
  try {
    const token = core.getInput('github-token', { required: true });
    const packageName = core.getInput('package-name');
    const personalAccount = core.getInput('personal-account');
    const repository = core.getInput('repository');
    const github = getOctokit(token);

    const accountType = personalAccount ? 'users' : 'orgs';
    const [owner, repo] = repository.split('/');
    const package = packageName || repo;
    const getUrl = `GET /${accountType}/${owner}/packages/container/${package}`;
    const { data: versions } = await github.request(getUrl);
    console.log("data=",versions);
    for (const version of versions) {
      const { metadata } = version;
      const { container } = metadata;
      const { tags } = container;
      console.log("container=",container);

      // if (!tags.length) {
      //   const { id } = version;
      //   try {
      //     const delUrl = `DELETE /${accountType}/${owner}/packages/container/${package}/versions/${id}`;
      //     await github.request(delUrl);
      //     console.log(
      //       `successfully deleted untagged image version: ${package} (${id})`,
      //     );
      //   } catch (error) {
      //     console.log(
      //       `cannot delete untagged image version: ${package} (${id})`,
      //     );
      //   }
      // }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
