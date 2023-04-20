const express = require("express")
const productsRouter = require("./routes/products.routers.js")
const cartRouter = require("./routes/cart.routers.js")
const app = express()

app.use(express.json())
const router = express.Router()

// Configurar rutas
router.use("/",productsRouter)
router.use("/api/cart",cartRouter)

app.use(router)

app.listen(8080, () => console.log("Servidor en puerto 8080"))

module.exports = router;
