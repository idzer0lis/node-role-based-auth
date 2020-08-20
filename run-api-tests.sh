#!/usr/bin/env bash
set -x

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

APIURL=${APIURL:-http://localhost:4000}
USERNAME=${USERNAME:-u`date +%s`}
PASSWORD=${PASSWORD:-password}

npx newman run $SCRIPTDIR/test.collection.json \
  --delay-request 500 \
  --global-var "APIURL=$APIURL" \
  --global-var "USERNAME=$USERNAME" \
  --global-var "PASSWORD=$PASSWORD"