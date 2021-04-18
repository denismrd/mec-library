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
    bnames : [String],
    btaken : [String],
    bdue : [String]
})
let user = mongo.model("student", userModel)
// let stud1 = new user({
//     Name : "denis",
//     Email : "denismrd9"
// })
// stud1.save().then((doc) => console.log(doc)).catch(err => console.log(err))


let port = process.env.PORT || 8000;
app.listen(port, ()=>console.log("started"))
if(process.argv[2]==="d") user.deleteMany({}, (err, result) => {
    if(err) console.log(err);
    else
    console.log("all documents deleted");
});


app.get("/", (req, res)=> {
    res.sendFile(`${__dirname}/static/index.html`)
})

// app.get("/register", (req, res)=> {
//     res.redirect("/")
// })

function convertDate(date) {
    let n = new Date(date)
    return `${(n.getDate()+"").padStart(2,"0")}-${(n.getMonth()+1+"").padStart(2,"0")}-${(n.getFullYear()+"").padStart(2,"0")}`
}

app.post("/register",urlencoded, (req, res) => {

    let data = {
        name : req.body.name,
        rollno : req.body.rollno,
        email : req.body.email,
        bcount : Number(req.body.bcount),
        bnames : [],
        btaken : [],
        bdue : []
    }
    for(let i=1; i<=req.body.bcount; i++) {
        data.bnames.push(req.body['bname' + i]);
        data.btaken.push(req.body['bdate' + i]);
        data.bdue.push(req.body['bdue'+i]);
    }
    user.findOne({email : data.email}, (err, doc) => {
        if(err) res.send(err)
        else {
            if(doc) {
                doc = doc._doc
                if(doc.rollno === data.rollno) {
                    if(doc.bcount + data.bcount > 3)
                    res.render("success",{
                        error: 1,
                        status:`you already have ${doc.bcount} remainders running and you are allowed to have only 3 remainders at a time, delete your previous reminders and try again.`,
                        info : "These are the reminders you have currently :",
                        showbooks : 1,
                        convertDate : convertDate,
                        ...doc
                    })
                    else {
                        for(let i=0; i<data.bcount; i++) {
                            doc.bnames.push(data.bnames[i])
                            doc.bdue.push(data.bdue[i])
                            doc.btaken.push(data.btaken[i])
                            doc.bcount++;
                        }
                        res.render("success",{
                            error: 0,
                            status:`Your reminders list is updated successfully`,
                            info : "These are the reminders you have currently :",
                            showbooks : 1,
                            convertDate : convertDate,
                            ...doc
                        })
                        user.updateOne({rollno : doc.rollno,email : doc.email}, doc, (err, doc)=>{
                            if(!err) remind()
                        })
                    }
                }
                else {
                    res.render("success", {
                        error : 1,
                        status: "This email id is registerd with another user, first delete those reminders and try again...",
                        showbooks : 0,
                        name: data.name
                    })
                }
            } else {
                user.create(data).then((doc) => {
                    res.render("success", {
                        error: 0,
                        status : "Your reminders got set up successfully.",
                        info : "You will be notified with the email before the following due dates :",
                        showbooks : 1,
                        convertDate : convertDate,
                        ...data
                    })
                    let str = "";
                    let i;
                    for(i=0; i<data.bcount-1; i++) {
                        str+=`<b>${i+1}) ${data.bnames[i]}</b> <br><br> Date taken : ${convertDate(data.btaken[i])}&emsp;&emsp;
                        Due Date : ${convertDate(data.bdue[i])}<br><br>`
                    }
                    str+=`<b>${i+1}) ${data.bnames[i]}</b> <br><br> Date taken : ${convertDate(data.btaken[i])}&emsp;&emsp;
                        Due Date : ${convertDate(data.bdue[i])}`
                    let mailoptions = {
                        from : '"MEC Library" muthayammal.library.edu@gmail.com',
                        to : data.email,
                        subject: "Reminders got set up successfully",
                        html :`Hi <b>${data.name}</b>,
                        <br>
                        <br>
                        Your reminders got set up successfully, you will be reminded about the due dates through this mail id.
                        <br>
                        <br>
                        Here are the details about the books you've taken :<br><br><hr>
                        ${str}<hr><br>
                        Learn freely without worry about due date, we are here to remind you!
                        <br>
                        <br>
                        KEEP READING!!&emsp;  KEEP GROWING!!`
                    }
                    transporter.sendMail(mailoptions, (err, det)=> {
                        if (err) {}
                        else remind()
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

function remind() {
   
    user.find({},(err, res)=> {
        
        if(!err) {
            let d1 = new Date();
            let d2 = new Date();
            let d3 = new Date();
            d2.setDate(d1.getDate()+1)
            d3.setDate(d1.getDate()+2)
            d1 = `${d1.getFullYear()}-${((d1.getMonth()+1)+"").padStart(2,"0")}-${(d1.getDate()+"").padStart(2,'0')}`
            d2 = `${d2.getFullYear()}-${((d2.getMonth()+1)+"").padStart(2,"0")}-${(d2.getDate()+"").padStart(2,'0')}`
            d3 = `${d3.getFullYear()}-${((d3.getMonth()+1)+"").padStart(2,"0")}-${(d3.getDate()+"").padStart(2,'0')}`
            
            for(let doc of res) {
                doc = doc._doc
                let ex_bk=""
                
                let dudoc = {
                    bcount : doc.bcount,
                    bnames : [...doc.bnames],
                    btaken : [...doc.btaken],
                    bdue : [...doc.bdue]
                }
                let nm = 1;
                let f=0;
                for(let i=0; i<dudoc.bcount; i++) {
                    if(dudoc.bdue[i]===d1) {
                        //console.log("yes today is due date");
                        f=1;
                        ex_bk+=`<b>${nm++}) ${dudoc.bnames[i]}</b> <br><br> Date taken : ${convertDate(dudoc.btaken[i])}&emsp;&emsp;
                        Due Date : ${convertDate(dudoc.bdue[i])}<br><br>`;
                        doc.bdue.splice(doc.bdue.indexOf(dudoc.bdue[i]),1)
                        doc.btaken.splice(doc.btaken.indexOf(dudoc.btaken[i]),1)
                        doc.bnames.splice(doc.bnames.indexOf(dudoc.bnames[i]),1)
                        doc.bcount--;
                    }
                    if(dudoc.bdue[i]===d2||dudoc.bdue[i]===d3) {
                        //console.log("due date is close");
                        f=1;
                        ex_bk+=`<b>${nm++}) ${dudoc.bnames[i]}</b> <br><br> Date taken : ${convertDate(dudoc.btaken[i])}&emsp;&emsp;
                        Due Date : ${convertDate(dudoc.bdue[i])}<br><br>`;
                    }
                }
                if(f) {
                    let mailoptions = {
                        from : '"MEC Library" muthayammal.library.edu@gmail.com',
                        to : doc.email,
                        subject: "Due date alert!!",
                        html :`Hi <b>${doc.name}</b>,
                        <br>
                        <br>
                        Some of the books you've taken from the library are going to expire, so take necessary action to avoid fine.
                        <br>
                        <br>
                        Here are the details about the expiring books :<br><br><hr><br>
                        ${ex_bk}<hr><br>
                        Learn freely without worry about due date, we are here to remind you!
                        <br>
                        <br>
                        KEEP READING!!&emsp;  KEEP GROWING!!`
                    }
                    transporter.sendMail(mailoptions, (err, det)=> {
                        // if(err) {console.log(err)}
                        // else {console.log("due mail sent")}
                    })
                    if(doc.bcount===0) {
                        user.deleteOne({rollno:doc.rollno, email:doc.email}, (err,res)=> {
                            //if(!err) console.log("doc deleted")
                        })
                    }
                    else
                    user.updateOne({rollno:doc.rollno, email:doc.email}, doc, (err,res)=>{
                        
                    })
                }
            }
        }
    })
}


