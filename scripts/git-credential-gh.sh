#!/bin/sh
if [ "$1" != get ]; then
  exit 0
fi
cat >/dev/null
token=$(gh auth token) || exit 1
printf 'username=x-access-token\npassword=%s\n' "$token"
