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

1.  Ensure you have

    `npm` installed - goto http://nodejs.org/download/ to download installer for your OS.  
    `ruby` installed - goto https://www.ruby-lang.org/en/documentation/installation/ to download latest version of ruby.

<br/> Note: On Ubuntu Linux you can use 'sudo apt-get install npm nodejs-legacy' (nodejs-legacy is required to avoid the ""/usr/bin/env: node: No such file or directory" problem).
<br/> Tip: If you are using Ubuntu/Linux, then doing `npm config set prefix ~` prevents you from having to run npm as root.

1.  Clone this repository to your local filesystem (default branch is 'develop')

1.  To download the dependencies, and be able to build, first install bower & grunt

    ```
     npm install -g bower
     npm install -g grunt-cli
    ```

1.  Next pull the runtime and build time dependencies by running bower, npm and gem bundler install commands on the project root folder

    ```
     bower install
    ```

    ```
     npm install
    ```

    ```
     bundler install
    ```

1.  To preview the app, run the following command on the project root folder

    ```
     grunt serve
    ```

    or open the 'index.html' file in FIREFOX browser

    Note: If you see a warning similar to the one shown below on running `grunt serve` , try increasing the number of open files limit as per the suggestions at http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux/

    ```
     Waiting...Warning: EMFILE, too many open files
    ```

1.  Default username/password: mifos/password. This application will hit the demo server by default.

You are done.

## <a name="question"></a> Got a Question or Problem?

If you have got any questions or problem, please email to our [mailing list](https://lists.sourceforge.net/lists/listinfo/mifos-developer)

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

Our central development branch is `develop` , which should be clean and ready for release at any time. Feel free to discuss about any issue in gitter channel

1.  **Choose a descriptive branch name** - It should be like `issue-1888` if your are working on issue number 1888

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

- Include the URLs to the views that are effected by the PR. For example, if the PR has some improvements in the clients page, have the URL information as: https://demo.openmf.org/newbeta/#/clients

5.  Please ensure that the code you write is well-tested.

_Wait for your PR to get reviewed till then you can start working on another issue_

6.  Squash all your commits to a single commit.

## <a name="communication"></a> Communication Channels

### Mailing lists

We have several mailing lists in the form of Google groups that you can join:

- [Mifos-Developer](https://lists.sourceforge.net/lists/listinfo/mifos-developer)

- [Chat room](https://gitter.im/openMF/mifos)
