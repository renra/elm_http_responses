FROM renra/elm:0.19.1

ENV DIR /usr/src/app
RUN mkdir -p ${DIR}
WORKDIR ${DIR}

RUN npm install --unsafe-perm -g elm-format sass && \
  npm install node-watch

COPY elm.json elm.json

# A trick to satisfy the elm compiler with a minimal file
#  so that we can call `elm make` which downloads dependencies
RUN app=HttpResponses && \
  file=src/elm/${app}.elm && \
  mkdir -p src/elm && \
  mkdir -p src/scss && \
  echo "module ${app} exposing(..)" > ${file} && \
  echo 'greet = "Hi"' >> ${file} && \
  elm make ${file}

COPY Makefile Makefile
COPY server.js server.js
COPY watcher.js watcher.js

# Any change in the src folder invalidates the cache of this step
#  but the dependencies are still cached
COPY src src
