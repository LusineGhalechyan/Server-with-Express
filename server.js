const Joi = require(`joi`);
const express = require(`express`);
const logger = require(`./logger`);

const PRODUCTS = [
  { id: 1, name: `desk` },
  { id: 2, name: `table` },
  { id: 3, name: `chair` },
];

const server = express();

server.use(express.json());
server.use(logger);

// GET
server.get(`/api`, (req, res) => {
  res.send(`Hello from Tigran!!!`);
});

// T.Asriyan's task
server.get(`/`, (req, res) => {
  let getSeconds = new Date().getSeconds();
  if (getSeconds % 2 === 0) res.send(`Seconds are even`);
  res.status(403).send(`Seconds are odd`);
});

server.get(`/api/products`, (req, res) => {
  res.send([1, 2, 3]);
});

server.get(`/api/products/:year/:month`, (req, res) => {
  res.send(req.query);
});

server.get(`/api/products/:id`, (req, res) => {
  const product = PRODUCTS.find((p) => p.id === parseInt(req.params.id));
  if (!product) res.status(404).send(`The product is not found !`);
  res.send(product);
});

//POST
server.post(`/api/products`, (req, res) => {
  const reqBodyName = req.body.name;

  const schema = {
    name: Joi.string().min(3).required(),
  };

  const validObj = Joi.validate(req.body, schema);

  if (validObj.error) {
    res.status(400).send(validObj.error.details[0].message);
    return;
  }
  const product = {
    id: PRODUCTS.length + 1,
    name: reqBodyName,
  };

  PRODUCTS.push(product);
  res.send(product);
});

//PUT
server.put(`/api/products/:id`, (req, res) => {
  const product = PRODUCTS.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    res.status(404).send(`The product with given ID is not found !`);
    return;
  }

  // Validate
  const schema = {
    name: Joi.string().min(3).required(),
  };

  const validObj = Joi.validate(req.body, schema);
  if (validObj.error) {
    res.status(400).send(validObj.error.details[0].message);
    return;
  }

  // Update product
  product.name = req.body.name;
  // return the updated product
  res.send(product);
});

// DELETE
server.delete(`/api/products/:id`, (req, res) => {
  const product = PRODUCTS.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    res.status(404).send(`The product with given ID is not found !`);
    return;
  }

  const index = PRODUCTS.indexOf(product);
  PRODUCTS.splice(index, 1);

  res.send(product);
});

const port = 5000;
server.listen(port, () =>
  console.log(`Server running on ${"http://localhost:"}${port}`)
);
