 const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongodb")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

 

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name })

        if (checking) {
            res.send("User Details already exist")
        } else {
            await LogInCollection.insertMany([data])
            res.status(201).render("home",   {
                name: req.body.name,
                password: req.body.password
            })
        }
    } catch (error) {
        res.send("An error occurred while processing the request")
    }
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home",  {
                name: req.body.name,
                password: req.body.password
            })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})



app.listen(port, () => {
    console.log('port connected');
})