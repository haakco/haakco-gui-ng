#!/usr/bin/env bash
# Do not do this in master only in your own branch
# check what needs to be updated
#npm install -g @angular/cli@latest
npm install -g @angular/cli@latest
npm install @angular/cli@latest --save
#npm install @angular/cli@latest --save
git commit -a -m 'Update'
ng update @angular/cli @angular/core --createCommits=true
git commit -a -m 'Update @angular/cli'
ng update @angular/material --createCommits=true
git commit -a -m 'Update @angular/material'
ng update --all
git commit -a -m 'ng update --all'
ncu

# Update what you think should be updated
# do not upgrade zone.js and typescript they are updated by ng update @angular/cli

rm -rf node_modules package-lock.json
npm install
npm prune
npm dedupe
git commit -a -m 'Update'
git push
# Now test
