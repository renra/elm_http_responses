// Initial Checks
const isEnvVarEmpty = function(key) {
  const value = process.env[key];

  if(typeof value === 'undefined' || value == '') {
    console.error(`Missing key: ${key}` )
    return true;
  }

  return false
}

const areAnyEnvVarsMissing = function() {
  return false;
}

if(areAnyEnvVarsMissing()) {
  console.error("Please fill in all values in your .env file first.");
  process.exit(1);
}

//

const
  fs = require('fs'),
  http = require('http'),
  port = process.env.PORT;

const readFile = function(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, contents) {
      if(err) {
        reject(err);
      } else {
        resolve(contents);
      }
    })
  });
}

const getIndexBody = function(variables) {
  let template = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" type="text/css" href="src/dist/app.css" />
      </head>

      <body>
        <div id="outlet"></div>

        <script src="src/dist/app.js"></script>

        <script type="text/javascript">
          // Look! I'm client-side JavaScript in server-side JavaScript!
          var node = document.getElementById('outlet');
          var app = 'HttpResponses';

          if(typeof Elm === 'object' && Elm[app] && Elm[app].init) {
            Elm[app].init({
              node: node,
              flags: {
              }
            });
          } else {
            node.innerHTML = 'Compilation failed. See errors on your command line.';
          }
        </script>
      </body>
    </html>
  `

  Object.keys(variables).forEach(function(key) {
    template = template.replace(key, variables[key]);
  });

  return template;
};

const user1 = {
  id: 1,
  name: "John"
};

const user2 = {
  id: 2,
  name: "Peter"
};

http.createServer(async function (req, res) {
  if(req.url.startsWith('/favicon.ico')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  } else if(req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(getIndexBody({}));
    res.end();
  } else if(req.url == '/200') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify([user1, user2]))
    res.end();
  } else if(req.url == '/201') {
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(user1))
    res.end();
  } else if(req.url == '/202') {
    res.writeHead(202, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({eta: 1000}))
    res.end();
  } else if(req.url == '/204') {
    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end();
  } else if(req.url == '/400') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({error: 'count not parse payload'}))
    res.end();
  } else if(req.url == '/401') {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({reason401: 'authentication outdated'}))
    res.end();
  } else if(req.url == '/403') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({reason403: 'permission to section not granted'}))
    res.end();
  } else if(req.url == '/404') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({reason404: 'could not find resource'}))
    res.end();
  } else if(req.url == '/422') {
    res.writeHead(422, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({errors: { name: ['cannot be blank'] }}))
    res.end();
  } else if(req.url == '/500') {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({reason500: 'unexpected error happened'}))
    res.end();
  } else {
    const
      filepath = `.${req.url}`;

    await readFile(filepath)
      .then(function(contents) {
        res.write(contents);
        res.end();
      })
      .catch(function(err) {
        console.log(err);

        res.writeHead(404);
        res.write(err.toString());
        res.end();
      })
  }
}).listen(port);

console.log(`Server listening on port ${port}`);
