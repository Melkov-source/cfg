#!/bin/bash

pushd ..

  npm install && npm run build

    pushd ./public

      start http://127.0.0.1:8080 && http-server

    popd

popd