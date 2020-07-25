npm run build

Set-Location dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:canbax/namaz-vakti.git master:gh-page