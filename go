#!/bin/sh
git add * && git commit -am 'edit' && git push origin master && git push
heroku-staging master
