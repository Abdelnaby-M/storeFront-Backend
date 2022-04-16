import express from "express";
import {checkAuthHeader, getTokenByUser} from "../services/auth"
import {User, UserStore} from "../models/user"

const router: express.Router = express.Router();
const UserStoreInstance = new UserStore();

router.get('/', checkAuthHeader,
async function(req, res, next) {
  try {
    const users: User[] = await UserStoreInstance.index()

    res.json(users)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
});

router.post("/create",  async function(req, res, next) {
  try {
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string

    if (firstname === undefined || lastname === undefined || username === undefined || password === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :firstname, :lastname, :username, :password")
      return false
    }

    const user: User = await UserStoreInstance.create({firstname, lastname, username, password})

    res.json(getTokenByUser(user))
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

    const user: User = await UserStoreInstance.read(id)

    res.json(user)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
});


router.put('/:id', checkAuthHeader,
async function(req, res, next) {

  try {
    const id = req.params.id as unknown as number
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string

    if (firstname === undefined || lastname === undefined || id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :firstname, :lastname, :id")
      return false
    }

    const user: User = await UserStoreInstance.update(id, {firstname, lastname})

    res.json(user)
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

    await UserStoreInstance.deleteUser(id)

    res.send(`User with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
});


router.post("/auth",  async function(req, res, next) {

  try {
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string

    if (username === undefined || password === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :username, :password")
      return false
    }

    const user: User | null = await UserStoreInstance.authenticate(username, password)

    if (user === null) {
      res.status(401)
      res.send(`Wrong password for user ${username}.`)

      return false
    }

    res.json(getTokenByUser(user))
  } catch (e) {
    res.status(400)
    res.json(e)
  }
});


export default router;