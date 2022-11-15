#!/bin/sh

DENO_VERSION="v1.27.1"
curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=./deno-v1.27.1 sh -s v1.27.1
NO_COLOR=1 DENO_VERSION=v1.27.1 ./deno-v1.27.1/bin/deno task build