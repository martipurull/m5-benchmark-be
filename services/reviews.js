import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { reviewsValidation } from './validations.js'
import { getMovies, saveMovies } from '../library/fs-tools.js'

const reviewsRouter = express.Router({ mergeParams: true })

reviewsRouter.post('/', reviewsValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There are some problems with your review, please check and submit again."))
        } else {
            const movies = await getMovies()
            const movieToEditIndex = movies.findIndex(movie => movie.id === req.params.movieId)
            const newReview = { ...req.body, movieId: req.params.movieId, reviewId: uuidv4(), reviewCreatedAt: new Date() }
            if (movies[movieToEditIndex].reviews) {
                movies[movieToEditIndex].reviews.push(newReview)
            } else {
                movies[movieToEditIndex].reviews = []
                movies[movieToEditIndex].reviews.push(newReview)
            }
            await saveMovies(movies)
            res.status(201).send(`Review added successfully for ${ movies[movieToEditIndex].title }. `)
        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete('/:reviewId', async (req, res, next) => {
    try {
        const movies = await getMovies()
        const selectedMovie = movies.find(movie => movie.id === req.params.movieId)
        const remainingReviews = selectedMovie.reviews.filter(review => review.reviewId !== req.params.reviewId)
        selectedMovie.reviews = remainingReviews
        await saveMovies(movies)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})









export default reviewsRouter