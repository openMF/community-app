# Contributing to Mifos Community App

We would love you to contribute to Community and help make it better than it is today, As a contributor, here are guidelines we would like you to follow:

- [Building Community App](#build)
- [Question or Problem?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Commit Message Guidelines](#submit-pr)
- [Communication Channels](#communication)

## <a name="build"></a> Building the community app

## Building from source

See [README](README.md).

## <a name="question"></a> Got a Question or Problem?

If you have got any questions or problem, please email to our [mailing list](https://lists.sourceforge.net/lists/listinfo/mifos-developer).

If you would like to chat about the question in real-time, you can reach out via our [Gitter](https://gitter.im/openMF/community-app) channel.

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by submitting an issue to our [GitHub Repository](https://github.com/openMF/community-app). Even better, you can submit a Pull Request with a fix.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to _implement_ a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

- For a **Major Feature**, first open an issue and outline your proposal so that it can be
  discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
  and help you to craft the change so that it is successfully accepted into the project.
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

- Follow the Issue Template while creating the issue.
- Include Screenshots if any (specially for UI related issues)
- For UI enhancements or workflows, include mockups to get a clear idea.

### Best Practices for assigning an issue:

- If you would like to work on an issue, inform in the issue ticket by commenting on it.
- Please be sure that you are able to reproduce the issue, before working on it. If not, please ask for clarification by commenting or asking the issue creator.

## <a name="submit-pr"></a> Submitting a Pull Request (PR)

### Instruction for making a code change

**Working on your first pull requests ?** You can learn how from this free series [How to Contribute to an Open Source Project on GitHub.](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

Our central development branch is `develop` , which should be clean and ready for release at any time. Feel free to discuss about any issue in gitter channel:

1.  **Choose a descriptive branch name** - It should be like `issue-1888` if your are working on issue number 1888.

2.  **Create a branch name with this name, starting from develop** -

`git fetch upstream`

`git checkout develop`

`git merge upstream/develop`

`git checkout -b your-branch-name`

3.  **Make commit to your feature branch**- Each commit should be self-contained and have a descriptive commit message that helps other developers understand why the changes were made.

    - If you are sending PR then it should notify which issue you are solving. Like this `BranchName: Fix #issueno - description`

      For example `Fix #1234 - Issue Description`

4.

- If the PR is for solving some Issue related to UI, post 2 pictures, first picture containing the earlier UI and the second picture containing the updated UI.

- Include the URLs to the views that are effected by the PR. For example, if the PR has some improvements in the clients page, have the URL information as: https://demo.mifos.io/newbeta/#/clients

5.  Please ensure that the code you write is well-tested.

_Wait for your PR to get reviewed till then you can start working on another issue_

6.  Squash all your commits to a single commit.

## <a name="communication"></a> Communication Channels

### Mailing lists

We have several mailing lists in the form of Google groups that you can join:

- [Mifos-Developer](https://lists.sourceforge.net/lists/listinfo/mifos-developer)

- [Chat room](https://gitter.im/openMF/mifos)
