const express = require("express")
const app = express()

let port = process.env.PORT || 8000;
app.listen(port)
app.get("/", ()=> {
    console.log("hello from server")
})
