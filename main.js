const core = require('@actions/core');
const { graphql } = require('@octokit/graphql');

async function main() {
  try {
    const token = core.getInput('github-token', { required: true });
    const packageName = core.getInput('package-name');
    const namespace = core.getInput('namespace');
    const repository = core.getInput('repository');

    const octokit = graphql.defaults({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const accountType = namespace ? 'User' : 'Organization';
    const [owner, repo] = repository.split('/');
    const package = packageName || repo;

    const query = `query($owner: String!, $repo: String!, $package: String!) {
      repository(owner: $owner, name: $repo) {
        packages(first: 1, names: [$package], packageType: DOCKER) {
          edges {
            node {
              latestVersion {
                id
                version
              }
            }
          }
        }
      }
    }`;

    const variables = {
      owner,
      repo,
      package,
    };

    const response = await octokit(query, variables);
    const version = response.repository.packages.edges[0]?.node.latestVersion.version;

    if (version) {
      console.log(`Latest version of package '${package}': ${version}`);
      core.setOutput('package-version', version);
    } else {
      console.log(`Package '${package}' not found or no versions available.`);
      core.setFailed(`Package '${package}' not found or no versions available.`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
