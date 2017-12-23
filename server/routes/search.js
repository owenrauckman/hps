import { Router } from 'express'

import SearchModel from '../models/search'

const Search = new SearchModel()

const router = Router()

router.get('/', async (req, res) => {
  res.send(await Search.search(req.query))
})

router.get('/companies', async (req, res) => {
  res.send(await Search.getCompanies())
})

router.get('/industries', async (req, res) => {
  res.send(await Search.getIndustries())
})

router.get('/cities', (req, res) => {
  res.send(Search.getCitiesInState(req.query))
})

router.get('/states', (req, res) => {
  res.send(Search.getStates())
})

router.get('/premium', async (req, res) => {
  res.send(await Search.searchPremium())
})

export default router
