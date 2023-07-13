const core = require('@actions/core');
const { getOctokit } = require('@actions/github');
// const { graphql } = require('@octokit/graphql');

// async function graphQuery() {
//   const token = core.getInput('github-token', { required: true });
//   const packageName = core.getInput('package-name');
//   const personalAccount = core.getInput('personal-account');
//   const repos = core.getInput('repository');
//   const github = getOctokit(token);
//   const [owner, repo] = repos.split('/');
//   const graphqlWithAuth = graphql.defaults({
//     headers: {
//       authorization: token,
//     },
//   });
//   const { repository } = await graphqlWithAuth(`
//     {
//       repository(owner: "octokit", name: "graphql.js") {
//         issues(last: 3) {
//           edges {
//             node {
//               title
//             }
//           }
//         }
//       }
//     }
//   `);
// }
async function restQuery() {
  try {
    const token = core.getInput('github-token', { required: true });
    const packageName = core.getInput('package-name');
    const personalAccount = core.getInput('personal-account');
    const repository = core.getInput('repository');
    const github = getOctokit(token);

    const accountType = personalAccount ? 'users' : 'orgs';
    const [owner, repo] = repository.split('/');
    const package = packageName || repo;
    console.log("rest:",owner,repo, package, accountType);
    const getUrl = `GET /${accountType}/${owner}/packages/container/${package}`;
    const { data: metadata } = await github.request(getUrl);
    console.log('metadata=', metadata);
    core.setOutput('package-metadata', JSON.stringify(metadata));
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function main() {
  restQuery();
}

main();
