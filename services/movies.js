import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

const moviesRouter = express.Router({ mergeParams: true })













export default moviesRouter