import express from 'express'
import router from './routes/index.js'
import error_handler from './middlewares/error_handler.js'
import not_found_handler from './middlewares/not_found_handler.js'
import { engine } from 'express-handlebars'
import { __dirname } from './utils.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views',__dirname+'/views')

app.use('/', router)
app.use('/public', express.static('public'))

app.use(error_handler)
app.use(not_found_handler)

export default app