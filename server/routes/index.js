import { Router } from 'express'

import users from './users'
import search from './search'

const router = Router()

// Add USERS and SEARCH Routes
router.use('/users', users)
router.use('/search', search)

export default router
