import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { getMovies, saveMovies } from '../library/fs-tools.js'

const uploadMoviePosterRouter = express.Router({ mergeParams: true })

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET
})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'strive-netflix',
    },
});

const parser = multer({ storage: cloudinaryStorage })

uploadMoviePosterRouter.put('/', parser.single('moviePoster'), async (req, res, next) => {
    try {
        const movies = await getMovies()
        const selectedMovie = movies.find(movie => movie.id === req.params.movieId)
        selectedMovie.poster = req.file.path
        await saveMovies(movies)
        res.send(`Movie poster uploaded successfully and kept at ${ selectedMovie.poster }`)
    } catch (error) {
        next(error)
    }
})



export default uploadMoviePosterRouter