import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { getMovies, saveMovies } from '../library/fs-tools.js'
import { movieValidation } from './validations.js'

const moviesRouter = express.Router({ mergeParams: true })

moviesRouter.post('/', movieValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, `There are some problems with your submission, namely: ${ { errorList } }`))
        } else {
            const movies = await getMovies()
            const newMovie = { ...req.body, id: uuidv4(), createdAt: new Date() }
            movies.push(newMovie)
            await saveMovies(movies)
            res.status(201).send(`New movie added with id: ${ newMovie.id }`)
        }
    } catch (error) {
        next(error)
    }
})

moviesRouter.get('/', async (req, res, next) => {
    try {
        const movies = await getMovies()
        if (req.query && req.query.title) {
            const filteredMovies = movies.filter(movie => movie.title.includes(req.query.title))
            res.send(filteredMovies)
        } else {
            res.send(movies)
        }
    } catch (error) {
        next(error)
    }
})

moviesRouter.get('/:movieId', async (req, res, next) => {
    try {
        const movies = await getMovies()
        const selectedMovie = movies.find(movie => movie.id === req.params.movieId)
        selectedMovie ? res.send(selectedMovie) : next(404, "Sorry, the selected movie doesn't seem to exist in our database.")
    } catch (error) {
        next(error)
    }
})

moviesRouter.put('/:movieId', async (req, res, next) => {
    try {
        const movies = await getMovies()
        const movieToEditIndex = movies.findIndex(movie => movie.id === req.params.movieId)
        const editedMovie = { ...movies[movieToEditIndex], ...req.body, updatedAt: new Date() }
        movies[movieToEditIndex] = editedMovie
        await saveMovies(movies)
        res.send(`${ editedMovie.title } edited successfully: ${ editedMovie }`)
    } catch (error) {
        next(error)
    }
})

moviesRouter.delete('/:movieId', async (req, res, next) => {
    try {
        const movies = await getMovies()
        const remainingMovies = movies.filter(movie => movie.id !== req.params.movieId)
        await saveMovies(remainingMovies)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default moviesRouter