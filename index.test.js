const main = require("./index");
describe("package action tests", () => {
  it("check if inputs are received", async () => {
    const core = {
      getInput: jest.fn().mockReturnValueOnce("my-value"),
      setFailed: jest.fn(),
      setOutput: jest.fn(),
    };
    const github = {
      getOctokit: jest.fn(),
    };
    await main.main(core, github);

    expect(core.getInput).toHaveBeenCalledWith("github-token", {
      required: true,
    });
    expect(core.getInput).toHaveBeenCalledWith("package-name");
    expect(core.getInput).toHaveBeenCalledWith("namespace");
    expect(core.getInput).toHaveBeenCalledWith("repository");
    expect(github.getOctokit).toHaveBeenCalledTimes(1);
  });
});