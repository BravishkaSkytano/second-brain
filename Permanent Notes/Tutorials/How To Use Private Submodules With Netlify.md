---
date: 2025-07-31
modified: 2025-08-03
view-count: 4
tags:
  - git
  - netlify
  - submodules
  - post
---

Netlify is a great resource for me because it allows me to build websites, using any static site generator I want, completely for free without worrying about storage or bandwidth. Plus, the URLs are clean and easy to set without feeling the need to buy your own domain. Netlify is quick, easy to use, and pretty versatile; however, the only issue I've run into that didn't have an easy and intuitive solution was using private [[Git Submodules|Git submodules]] within my site.

## What Are Git Submodules?

![[Git Submodules#^39456a]]

### Why Use Them?

Personally, I like using submodules for my site content so that I don't have to clone all the extra site configuration stuff that I rarely touch onto all my devices just to edit my posts. Plus, it allows me to easily setup CMS systems and tools like Obsidian because I don't have to point them to a subfolder three levels down.

At the time of writing this (and probably to this day), I'm using Obsidian to manage my site (also known as my Zettelkasten, or Second Brain). And it's pretty easy to access this on my handheld and writing devices because I have one repository dedicated to all my markdown files. I can open Obsidian on my laptop, start writing something, sync my work to GitHub, and pick it back up on my phone later without worrying about storage space or remembering where in my site configuration my content folder lives. I highly recommend this setup for ease of use, if you can get it configured properly.

### Why Use Private Submodules?

As an added security step, I make my submodules private just in case people clone my site, which I keep public in the name of FOSS and the spirit of GitHub. The content that I write is my own, regardless of the theme source files or the software I'm using, and I like to keep it that way. Making my content submodules private means that only those who have access to my account, or the organization (if the repo resides in one), can access and modify my site content. And I don't want to join the huge group of content creators who have had their content stolen without their knowledge only to stumble on it later.

Of course, I'm not that popular, so I doubt anyone would *want* to steal my content (at least, not yet), but it's still a good idea to set safeguards in place either way.

## How To Add A Submodule

 For the purpose of this tutorial, I recommend using SSH to authenticate as this is required for Netlify. If you have already added the submodule to your repository and you didn't use SSH, just continue on and I'll go over how to switch over.

![[How To Add A Submodule To A Repository#^76869d]]

## Setting Up Netlify To Access My Stuff

Netlify, by default, supports submodules from GitHub, GitLab, and BitBucket. However, when you're using *private* submodules, you need to give Netlify access to that private repo by using deploy keys.

### Build Configuration

Before you can setup deploy keys with Netlify, you need to have your repository connected. I won't go over the steps here, but follow what you would normally do for the SSG (Jekyll, Hugo, 11ty, etc.) that you're using. The only difference is in the build command, you need to change it to tell Netlify to initiative and pull submodules.

```
git submodule update --init --recursive && NORMAL_BUILD_COMMAND
```

Make sure you replace NORMAL_BUILD_COMMAND with whatever command you're SSG uses, e.g. `hugo` or `bundle exec jekyll build`.

### Configuring Your Deploy Key

1. Within Netlify, go to **Project Configuration > Build & deploy.**
2. Scroll down until you find **Deploy key** settings.
3. Click **Generate public deploy key** (this will create a public and private SSH key for you to copy.[^1]
4. Now, go to **GitHub** and sign in, if needed.
5. Go to your **private repo** which you added to your site as a submodule.
6. Access **Settings > Deploy keys.**
7. Click on **Add deploy key.**
8. Paste in your **Netlify deploy key** under the Key section.
9. Select **Allow write access.**
10. Click **Add key.**
11. Time to go back to **Netlify**.
12. Add a new site variable under **Project configuration > Environment variables.**
13. Name it something descriptive and **paste in the same deploy key.**
14. Click **Add a single variable.**
15. **Push** to your repository and **trigger a build** (if it doesn't automatically).

> [!info]
> If you added your submodule to your repo using HTTPS, you will need to switch to SSH for Netlify to be able to access the submodule. In your source code, using whatever editor you prefer, edit your `.gitmodules` file to use the SSH URL: `url = git@github.com:yourusername/CONTENT-REPO.git`

You should now be able to build your site successfully!

This does present another issue though, how do I get Netlify to build whenever I push to the content submodule? Remember, Netlify only builds when the site repo is updated, but our content now lives on an entirely separate repo that Netlify isn't monitoring. Is there a way to trigger a build on Netlify when the submodule is updated? Short answer, yes, here's how.

## Using GitHub Actions To Trigger Netlify Builds

The easiest and best way that I've found to trigger Netlify builds is by using GitHub Actions (since I use GitHub), which are simply workflow files that run automatically when certain parameters are met.[^2]

If you're not using GitHub, I do know that GitLab has their own version of GitHub Actions, but I don't remember what it's called. Just look on your platform for something called workflows or CI/CD development. You can also just lookup how to run workflows on your platform and somebody should be able to help you.

### Adding Personal Access Tokens

Just like with Netlify, GitHub also needs a key to be able to access your private submodule, but this time we're going to use **Personal Access Tokens (PAT)** since both repositories live on GitHub.

1. Go to your account [Settings > Personal access tokens](https://github.com/settings/personal-access-tokens)
2. Under Repository secrets, **create a new token** with the following permissions:
	1. Read access to actions, metadata, and repo
	2. Read and write access to workflows, commit statuses, and pull requests
3. Now go to your **private content repo**
4. Go to **Settings > Security > Secrets and variables > Actions**
5. Add the PAT as a **new repository secret**
6. Go to your **public site repo** and **repeat steps 4 and 5**

### Private Repository Setup

In the private submodule repo, we need to add a workflow file that sends events to the parent repo when there are new updates to pull in.

1. On your private content repo, go to **Settings > Actions > General**
2. Click the checkbox for "Read and write permissions"
3. Click the checkbox for "Allow GitHub Actions to create and approve pull requests"
4. Now, go to **Actions > New Workflow**
5. Give your file a descriptive name like `dispatch-updates.yml`

> [!warning]
> For all the workflow files, make sure you go through and replace the `PAT` in `${{ secrets.PAT }}` with whatever you called your secret or else your actions will fail.

```yml
name: Dispatch Updates
on:
  workflow_dispatch:
  push:
    branches:
      - master
jobs:
  dispatch:
    runs-on: ubuntu-24.04
    steps:
      - uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PAT }}
          repository: YOUR_USERNAME/YOUR_SITE_REPO
          event-type: update-submodule
```

#### (Optional) Use Schedule Instead Of Pushes

Personally, I don't like to update my site every time I make a push to my submodule. I prefer to run updates on a schedule, like once day or three days a week, using cron jobs. To do that, just change the part on your workflow that starts with `on`:

```yml
on:
  # Allows you to run this workflow manually from the Actions tab or through HTTP API
  workflow_dispatch:
  schedule:
    # Run at 5:50 AM UTC every day
    - cron: '50 5 * * *'
```

### Public Repository Setup

Now it's time to create a workflow file to receive the event from the submodule.

1. On your public site repo, go to **Settings > Actions > General**
2. Click the checkbox for "Read and write permissions"
3. Click the checkbox for "Allow GitHub Actions to create and approve pull requests"
4. Now, go to **Actions > New Workflow**
5. Give your file a descriptive name like `update-submodule.yml`

There are multiple ways to setup your workflow file, and it's based on personal preference. The basic start would be the following:

```yml
name: Update Submodule

on:
  repository_dispatch:
    types:
      - update-submodule

jobs:
  update-submodule:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.PAT }}
          submodules: recursive

      - name: Authorize Git
        run: |
          git config --global user.email "bot@noreply.github.com"
          git config --global user.name "Git Bot"
          
      - name: Update submodules
        run: |
          git submodule update --init --recursive --remote
        env:
          GITHUB_TOKEN: ${{ secrets.PAT }}

      - name: Commit changes
        run: |
          git add content
          git commit -m "Update submodules"
          git push origin v4
        env:
          GITHUB_TOKEN: ${{ secrets.PAT }}
```

#### (Optional) Use Pull Requests

If you want to create pull requests for new updates instead of committing straight to the master branch, replace the `jobs` section with the following:

```yml
jobs:
  update-submodule:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.PAT }}
          submodules: recursive

      - name: Authorize Git
        run: |
          git config --global user.email "bot@noreply.github.com"
          git config --global user.name "Git Bot"
          
      - name: Generate Unique variable based on timestamp
        run: echo BRANCH=$(date +%s) >> $GITHUB_ENV

      - name: Update submodules
        run: |
          git submodule update --init --recursive --remote

      - name: Commit changes
        run: |
          git add .
          git commit -m "Update submodules"

      - name: Create and push new branch
        run: |
          git checkout -b ${{ env.BRANCH }}
          git push origin ${{ env.BRANCH }}

      - name: Create pull request
        env:
          GITHUB_TOKEN: ${{ secrets.PAT }}
        run: |
          gh pr create -B develop -H ${{ env.BRANCH }} --title "PR: Submodule update to develop" --body "Created by Github action"

```

## Conclusion

By this point, you should have a fully functioning Netlify site with a private submodule and automatic updates. I'd like to thank Robert Viquez[^3] and Carlos Loriente[^4] for their articles that helped me figure this all out.

[^1]: [How SSH Authentication with GitHub Works Under the Hood](https://www.freecodecamp.org/news/ssh-authentication-with-github-under-the-hood/)
[^2]: [Learn to Use GitHub Actions: a Step-by-Step Guide](https://www.freecodecamp.org/news/learn-to-use-github-actions-step-by-step-guide/)
[^3]: [Netlify Deployment with Github Private Submodule \| Robert Viquez](https://robertviquez.com/blogs/netlify_deployment_github_submodule/)
[^4]: [GitHub Actions for Updating Git Submodules in Private Repos](https://www.notesoncloudcomputing.com/posts/2025-01-25-synchronizing-git-private-projects-with-public-repositories/)
