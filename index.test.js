const { main } = require('./index');
const core = require('@actions/core');
const github = require('@actions/github');
// jest.mock("@actions/core");

describe('package action tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('check if inputs are received', async () => {
    const mockGetInput = jest.spyOn(core, 'getInput').mockImplementation();
    const mockSetFailed = jest.spyOn(core, 'setFailed');
    const mockSetOutput = jest.spyOn(core, 'setOutput').mockImplementation();
    const mockGetOctokit = jest
      .spyOn(github, 'getOctokit')
      .mockImplementation();
    main(core, github);

    expect(mockGetInput).toHaveBeenCalledWith('github-token', {
      required: true,
    });
    expect(mockGetInput).toHaveBeenCalledWith('package-name');
    expect(mockGetInput).toHaveBeenCalledWith('namespace');
    expect(mockGetInput).toHaveBeenCalledWith('repository');
    expect(mockGetOctokit).toHaveBeenCalledTimes(1);
  });
});
