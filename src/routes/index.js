import express from 'express'
import {
    signIn,
    signOut,
    signUp,
    updateAccount,
    updatePassword
} from '../controllers/account.controller.js'
import {
    addEmployee,
    deleteEmployee,
    getAllEmployees,
    getOneEmployee,
    updateEmployee
} from '../controllers/employee.controller.js'
import {
    addJob,
    getAllJobs,
    getOneJob,
    updateJob,
    deleteJob,
} from '../controllers/job.controller.js'
import { refreshToken } from '../controllers/refreshToken.controller.js'
import {
    addRole
} from '../controllers/role.controller.js'
import { requireSuper, requireToken } from '../middlewares/requireToken.js'

const router = express.Router()
const v1 = '/api/v1'

// Auth routes
router.get(`${v1}/refresh`, refreshToken)
router.post(`${v1}/signup`, signUp)
router.post(`${v1}/signin`, signIn)
router.patch(`${v1}/updateAccount`, requireToken, updateAccount)
router.patch(`${v1}/updatePassword`, requireToken, updatePassword)
router.delete(`${v1}/signout`, signOut)

// Role routes
router.post(`${v1}/role`, requireSuper, addRole)

// Job routes
router.post(`${v1}/job`, requireToken, addJob)
router.get(`${v1}/jobs`, getAllJobs)
router.get(`${v1}/job/:id`, getOneJob)
router.patch(`${v1}/job/:id`, requireToken, updateJob)
router.delete(`${v1}/job/:id`, requireToken, deleteJob)

// Employee routes
router.post(`${v1}/employee`, requireToken, addEmployee)
router.get(`${v1}/employees`, getAllEmployees)
router.get(`${v1}/employee/:id`, getOneEmployee)
router.patch(`${v1}/employee/:id`, requireToken, updateEmployee)
router.delete(`${v1}/employee/:id`, requireToken, deleteEmployee)

export default router