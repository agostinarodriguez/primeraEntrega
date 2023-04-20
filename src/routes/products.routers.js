const express = require('express')
const fs = require('fs')
const router = express.Router()

let products = []

// Ruta POST para agregar un producto
router.post("/", (req, res) => {
  const product = req.body;
  console.log(req.body)
  //Validacion de campos product
  if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock|| !product.status || !product.category) {
      console.error('Error al agregar producto, es necesario completar todos los campos');
      res.status(400).json({ error: "Error al agregar producto, es necesario completar todos los campos" });
      return
  }

  const lastProduct = products[products.length - 1]
  const newId =lastProduct ? lastProduct.id + 1 : 1
  const productWithId = {...product, id: newId};
  products.push(productWithId)

  // Escribir los productos en products.json
  fs.writeFile('./products.json', JSON.stringify(products), (err) => {
  if (err) {
    console.error(err);
    res.status(500).json({ error: "Error al escribir los datos en el archivo" });
    return;
  }
  console.log('Productos escritos correctamente en el archivo');
  res.status(201).json(productWithId);
  })

})

//GET para listar productos
router.get('/', (req, res) => {
  console.log("GET /")
  res.json(products);
});

//GET para obtener producto por id
router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = products.find(product => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send(`Producto con id ${productId} no encontrado`);
  }
})

//PUT para actualizar un producto por id
  router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    // Actualizar producto
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    products[productIndex] = {
      id: productId,
      title: title || products[productIndex].title,
      description: description || products[productIndex].description,
      code: code || products[productIndex].code,
      price: price || products[productIndex].price,
      status: status || products[productIndex].status,
      stock: stock || products[productIndex].stock,
      category: category || products[productIndex].category,
      thumbnails: thumbnails || products[productIndex].thumbnails
    }

    //Escribir productos en products.json
    fs.writeFileSync('./products.json', JSON.stringify(products))

    res.json(products[productIndex]);
  } else {
    res.status(404).send(`Producto con id ${productId} no encontrado`);
  }
})

//DELETE para eliminar un producto por id
router.delete('/:pid', (req, res) => {
    const productId = Number(req.params.pid);
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      // Eliminar producto
        products.splice(productIndex, 1);

    // Escribir los productos en products.json
        fs.writeFileSync('./products.json', JSON.stringify(products));
        console.log(`Producto con ID ${productId} eliminado correctamente`)
        res.sendStatus(204);
    } else {
      res.status(404).send(`Producto con id ${productId} no encontrado`);
    }
  })

  module.exports = router;