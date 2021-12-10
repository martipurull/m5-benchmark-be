import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'
import moviesRouter from './services/movies.js'
import uploadMoviePosterRouter from './services/uploadMoviePoster.js'
import reviewsRouter from './services/reviews.js'
import downloadReviewsPDFRouter from './services/downloadReviewsPDF.js'

const server = express()
const port = process.env.PORT

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]
const corsOptions = {
    origin: function (origin, next) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            next(null, true)
        } else {
            next(new Error("CORS BLOCKADE"))
        }
    }
}

server.use(cors(corsOptions))
server.use(express.json())

server.use('/media', moviesRouter)
server.use('/media/:movieId/poster', uploadMoviePosterRouter)
server.use('/media/:movieId/reviews', reviewsRouter)
server.use('/media/:movieId/downloadPDF', downloadReviewsPDFRouter)

server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port ${ port }`)
})