#!/bin/bash
NUMBER_OF_NODES=5
NODE_NUMBER=$1
case "$NODE_NUMBER" in ("" | *[!0-9]*)
  echo 'Please provide the number of the node to attach to (i.e. ./attach.sh 2)' >&2
  exit 1
esac

if [ "$NODE_NUMBER" -lt 1 ] || [ "$NODE_NUMBER" -gt $NUMBER_OF_NODES ]; then
  echo "$NODE_NUMBER is not a valid node number. Must be between 1 and $NUMBER_OF_NODES." >&2
  exit 1
fi
BIN_GETH='/home/swcyb/.quorum-wizard/bin/quorum/21.4.0/geth'
BIN_TESSERA='/home/swcyb/.quorum-wizard/bin/tessera/21.1.1/tessera-app.jar'
BIN_CAKESHOP='/home/swcyb/.quorum-wizard/bin/cakeshop/0.12.1/cakeshop.war'

"$BIN_GETH" attach qdata/dd$1/geth.ipc