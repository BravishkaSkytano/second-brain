---
date: 2025-07-31
modified: 2025-10-05 22:04
tags:
  - git
  - submodules
draft: false
view-count: 4
---

Adding submodules is simple with two commands for each authentication method you want to use. The first command adds the submodule, while the second command tells Git to pull in the contents of the submodule.

For HTTPS, use the following:

```
git submodule add https://github.com/YOUR_USERNAME/SUBMODULE LOCAATION
git submodule update --init --recursive
```

And for SSH, you should use:

```
git submodule add git@github.com:YOUR_USERNAME/SUBMODULE LOCATION
git submodule update --init --recursive
```

^76869d