const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeProducts(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/products', (req, res) => res.json(readProducts()));

app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProd = { id: Date.now(), ...req.body };
  products.push(newProd);
  writeProducts(products);
  res.json(newProd);
});

app.put('/api/products/:id', (req, res) => {
  let products = readProducts();
  products = products.map(p => p.id == req.params.id ? { id: p.id, ...req.body } : p);
  writeProducts(products);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  let products = readProducts().filter(p => p.id != req.params.id);
  writeProducts(products);
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
