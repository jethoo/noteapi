const express = require('express')
const cors = require('cors')
const app = express()

//for changing request content to json format
app.use(express.json())
app.use(cors())
//Middleware is a function that receives three parameters:

//middleware functions are called in the order that they're taken into use
//with the express server object's use method
//notice that json-parser is taken into use before the requestLogger middlware
//because otherwise reques.body will not be initialized when the logger is executed
const requestLogger = (request, response, next) => {
    console.log('Method', request.method)
    console.log('Path', request.path)
    console.log('Body', request.body)
    console.log('---')
    //next function yields or gives control to the next middleware
    //or we can say it activates another middleware, after this function's role is done
    next()
}

//middleware for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)
//Middlware functions have to be taken into use before routes if we want them to be 
//executed before the route event handlers are called

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
      },
      {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
      },
      {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

//defining route for single resource
app.get('/api/notes/:id', (request,response) => {
    //request body's params gives the id
    const id = Number(request.params.id)
    const note = notes.find(note => {
        //console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    if(note){
        response.json(note)
    }else {
        response.status(400).end()
    }
})

app.delete('/api/notes/:id', (request,response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    //console.log('remaining notes', notes)
    response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    :0
    
  return maxId + 1
}

//console.log(Math.max(...notes.map(n => n.id)))
app.post('/api/notes', (request,response) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId
    }

    notes = notes.concat(note)
    response.json(note)
})


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

