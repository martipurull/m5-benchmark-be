import { body } from 'express-validator'

export const movieValidation = [
    body("title").exists().withMessage("Please provide a title for the movie or show."),
    body("year").exists().withMessage("Please provide the year the movie or show was released in."),
    body("type").exists().withMessage("Please provide the type of media: e.g. movie, show, documentary, etc.")
]

export const reviewsValidation = [
    body("comment").exists().withMessage("Please enter a comment for the movie or show."),
    body("rate").exists().withMessage("Please rate the movie or show.")
]