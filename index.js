const express = require("express")
const app = express()

let port = process.env.PORT || 8000;
app.listen(port, ()=>console.log("started"))
app.get("/", (req, res)=> {
    res.sendFile(`${__dirname}/static/index.html`)
})
app.use(express.static(`${__dirname}/static`))