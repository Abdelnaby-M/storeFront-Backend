import express from "express"
import {Product, ProductStore} from "../models/product"
import {checkAuthHeader} from "../services/auth"

const router: express.Router = express.Router();
const ProductStoreInstance = new ProductStore();

router.get("/", async function(req, res, next) {

    try {
        const products: Product[] = await ProductStoreInstance.index()
    
        res.json(products)
      } catch (error) {
        res.status(400)
        res.json(error)
      }    
});

router.post('create', checkAuthHeader,
    async function(req, res, next) {

    try {
        const name = req.body.name as unknown as string
        const price = req.body.price as unknown as number
    
        if (name === undefined || price === undefined) {
          res.status(400)
          res.send("Some required parameters are missing! eg. :name, :price")
          return false
        }
    
        const product: Product = await ProductStoreInstance.create({name, price})
    
        res.json(product)
      } catch (error) {
        res.status(400)
        res.json(error)
      }
});

router.get('/:id', async function(req, res, next) {

    try {
        const id = req.params.id as unknown as number
    
        if (id === undefined) {
          res.status(400)
          res.send("Missing required parameter :id.")
          return false
        }
    
        const product: Product = await ProductStoreInstance.read(id)
    
        res.json(product)
      } catch (error) {
        res.status(400)
        res.json(error)
      }
});

router.put('/:id', checkAuthHeader,
    async function(req, res, next) {

    try {
        const id = req.params.id as unknown as number
        const name = req.body.name as unknown as string
        const price = req.body.price as unknown as number
    
        if (name === undefined || price === undefined || id === undefined) {
          res.status(400)
          res.send("Some required parameters are missing! eg. :name, :price, :id")
          return false
        }
    
        const product: Product = await ProductStoreInstance.update(id, {name, price})
    
        res.json(product)
      } catch (e) {
        res.status(400)
        res.json(e)
      }
});

router.delete('/:id', checkAuthHeader,
    async function(req, res, next) {
    try {
        const id = req.params.id as unknown as number
    
        if (id === undefined) {
          res.status(400)
          res.send("Missing required parameter :id.")
          return false
        }
    
        await ProductStoreInstance.deleteProduct(id)
    
        res.send(`Product with id ${id} successfully deleted.`)
      } catch (error) {
        res.status(400)
        res.json(error)
      }
});

export default router;
