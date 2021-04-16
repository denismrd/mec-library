const express = require("express")
const mongo = require("mongoose")
const path = require("path")
const bdyprs = require("body-parser");
const mailer = require("nodemailer");

let transporter = mailer.createTransport({
    service:"gmail",
    auth: {
        user: "muthayammal.library.edu@gmail.com",
        pass: "edulibmec"
    }
})


let urlencoded = bdyprs.urlencoded({
    extended: false
})


const app = express()
app.use(express.static(path.join(__dirname, "static")))
app.set("view engine", "pug");
app.set("views", path.join(__dirname,"views"))

mongo.connect("mongodb+srv://Denis:Djeensiuss@libstudents.ocsfe.mongodb.net/users?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((con) => {
    console.log("connected successfully")
})

let userModel = new mongo.Schema( {
    name : {
        type: String,
        required : true
    },
    rollno : {
        type: String,
        required : true
    },
    email : {
        type: String, 
        required : true
    },
    bcount : Number,
    bname1 : String,
    bdate1 : String,
    bdue1 : String,
    bname2 : String,
    bdate2 : String,
    bdue2 : String,
    bname3 : String,
    bdate3 : String,
    bdue3 : String
})
let user = mongo.model("student", userModel)
// let stud1 = new user({
//     Name : "denis",
//     Email : "denismrd9"
// })
// stud1.save().then((doc) => console.log(doc)).catch(err => console.log(err))


let port = process.env.PORT || 8000;
app.listen(port, ()=>console.log("started"))
app.get("/", (req, res)=> {
    res.sendFile(`${__dirname}/static/index.html`)
})

// app.get("/register", (req, res)=> {
//     res.redirect("/")
// })

app.post("/register",urlencoded, (req, res) => {
    
    req.body.bcount = Number(req.body.bcount)
    user.findOne({email : req.body.email}, (err, doc) => {
        if(err) res.send(err)
        else {
            if(doc) {
                doc = doc._doc
                if(doc.rollno === req.body.rollno) {
                    if(doc.bcount + req.body.bcount > 3)
                    res.render("success",{
                        error: 1,
                        status:`you already have ${doc.bcount} remainders running and you are allowed to have only 3 remainders at a time, delete your previous reminders and try again.`,
                        info : "These are the reminders you have currently :",
                        showbooks : 1,
                        ...doc
                    })
                    else 
                    res.send("          I will add this option soon, please visit later...")
                }
                else {
                    res.render("success", {
                        error : 1,
                        status: "This email id is registerd with another user, first delete those reminders and try again...",
                        showbooks : 0,
                        name: req.body.name
                    })
                }
            } else {
                user.create(req.body).then((doc) => {
                    res.render("success", {
                        error: 0,
                        status : "Your reminders got set up successfully.",
                        info : "You will be notified with the email before the following due dates :",
                        showbooks : 1,
                        ...req.body
                    })
                    let mailoptions = {
                        from : '"MEC Library" muthayammal.library.edu@gmail.com',
                        to : req.body.email,
                        subject: "Reminders got set up successfully",
                        html :`Hi <b>${req.body.name}</b>,
                        <br>
                        <br>
                        Your reminders got set up successfully, you will be reminded about the due dates through this mail id.
                        <br>
                        <br>
                        Learn freely without worry about due date, we are here to remind you!
                        <br>
                        <br>
                        KEEP READING!!&emsp;  KEEP GROWING!!`
                    }
                    transporter.sendMail(mailoptions, (err, det)=> {
                        // if (err) {}
                        // else console.log("email sent " + det.response)
                    })
                    
                    // console.log("new document created successfully")
                    // console.log(doc)
                }).catch((err)=>{
                    // console.log(err)
                })
            }
        }
            

    })

})

