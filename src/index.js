require('dotenv').config()
var express = require('express');
var app = express();
var port = 8000;
var neo4j = require('neo4j-driver').v1;
var process = require('process');

var driver = neo4j.driver("bolt://localhost",
    neo4j.auth.basic("neo4j", "neo4j"))

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
    driver.close();
});

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')                                                       
})

var session = driver.session()

const resultPromise = session .run( 'CREATE (a:Person {name: $name}) RETURN a',
  {name: 'Alice'})

resultPromise.then(function (result) {
  session.close();
    console.log(result)
  const singleRecord = result.records[0];
  const node = singleRecord.get(0);
  // console.log(node.properties.name);
});

resultPromise.catch(function (err) {
    console.log('err', err)
});

app.listen(port, function () {
    console.log(`Demo app listening on port ${port}`)
});
