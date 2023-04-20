const express = require("express")
const fs = require("fs");
const router = express.Router()

let carts = []
try {
  carts = JSON.parse(fs.readFileSync("carts.json"));
} catch (err) {
  console.log("Error cargando archivos en el carrito", err);
}

//ID de carrito
let lastCartId = 0

//Crear carrito
router.post("/", (req, res) => {
  const { products } = req.body

  const newCart = {
    id: ++lastCartId,
    products: products || [],
  }
  carts.push(newCart);

 // Guardar la información de los carritos en el archivo carts.json
  fs.writeFileSync("carts.json", JSON.stringify(carts));

  res.status(201).json(newCart);
})

// Get products
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carts.find((cart) => cart.id == cid);

  if (!cart) {
    res.status(404).json({ error:"Carrito no encontrado"});
  } else {
    res.json(cart.products);
  }
});

// Agregar producto
router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = carts.find((cart) => cart.id == cid);
  if (!cart) {
    res.status(404).json({ error:"Carrito no encontrado"});
    return
  }

  // Verficar si existe
  const productIndex = cart.products.findIndex((product) => product.id == pid);
  if (productIndex === -1) {
    //Si no existe se agrega
    cart.products.push({ id: pid, quantity: quantity || 1 });
  } else {
    //Si existe,se incrementa
    cart.products[productIndex].quantity += quantity || 1;
  }
  //Guardar la informacion de los carritos en carts.json
  fs.writeFileSync("carts.json", JSON.stringify(carts));

  res.json(cart.products);
})

module.exports = router;
