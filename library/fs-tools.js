import fs from 'fs-extra'
import { join } from 'path'

const { readJSON, writeJSON, createReadStream } = fs

const mediaJSONPath = join(process.cwd(), './data/media.json')

export const getMovies = () => readJSON(mediaJSONPath)
export const saveMovies = (content) => writeJSON(mediaJSONPath, content)