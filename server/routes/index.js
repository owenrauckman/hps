import { Router } from 'express'

import users from './users'
import search from './search'
import auth from './auth'
import subscriptions from './subscriptions'

const router = Router()

// Add USERS and SEARCH Routes
router.use('/search', search)
router.use('/auth', auth)
router.use('/users', users)
router.use('/subscriptions', subscriptions)

export default router
