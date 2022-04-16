import express from "express"
import {Order, OrderProduct, OrderStore} from "../models/order"
import {checkAuthHeader} from "../services/auth"

const router: express.Router = express.Router();
const OrderStoreInstance = new OrderStore()

router.get('/', checkAuthHeader,
async function(req, res, next) {
  try {
    const orders: Order[] = await OrderStoreInstance.index()

    res.json(orders)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
});


router.post('/create', checkAuthHeader,
async function(req, res, next) {

  try {
    let products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (products === undefined || status === undefined || user_id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :products, :status, :user_id")
      return false
    }

    const order: Order = await OrderStoreInstance.create({products, status, user_id})

    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
});


router.get('/:id', checkAuthHeader,
async function(req, res, next) {

  try {
    const id = req.params.id as unknown as number

    if (id === undefined) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    const order: Order = await OrderStoreInstance.read(id)

    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
});

router.put('/:id', checkAuthHeader,
async function(req, res, next) {

  try {
    const id = req.params.id as unknown as number
    let products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (products === undefined || status === undefined || user_id === undefined || id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :products, :status, :user_id, :id")
      return false
    }

    const order: Order = await OrderStoreInstance.update(id, {products, status, user_id})

    res.json(order)
  } catch (error) {
    res.status(400)
    res.json(error)
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

    await OrderStoreInstance.deleteOrder(id)

    res.send(`Order with id ${id} successfully deleted.`)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
});
export default router;
