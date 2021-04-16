//Selecting DOM elements to manipulate
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
let books = [-1];
books.push(document.querySelector(".book1"));
books.push(document.querySelector(".book2"));
books.push(document.querySelector(".book3"));
const bcount = document.querySelector(".count");
const bcounthid = document.querySelector("input[type='number']");
const confirm = document.querySelector(".confirm-container");
const conbox = document.querySelector(".box");
const bookdet = document.querySelectorAll(".book-det");
let form = document.querySelector("form");
let submit = document.querySelector(".submit");

// if(performance.navigation.type == 2){
//     location.reload()
//  }

let bc = 1; //To track the books count
let today = new Date(); //Getting today's date
bcounthid.value =bc;

//---------------------------Functions---------------------------------

//Function to set the today date as default in the date input box
setTodayDate(1);
function setTodayDate(book_slot_no) {
    let inp = books[book_slot_no].querySelector(".date-box input")
    let t = new Date();
    t.setDate(t.getDate() - 15);
    let dtStr = `${
        today.getFullYear() + ""
    }-${(today.getMonth() + 1 + "").padStart(2, "0")}-${(
        today.getDate() + ""
    ).padStart(2, "0")}`;

    let dtStr2 = `${
        t.getFullYear() + ""
    }-${(t.getMonth() + 1 + "").padStart(2, "0")}-${(
        t.getDate() + ""
    ).padStart(2, "0")}`;
    inp.value = dtStr;
    
    inp.min = dtStr2;
    inp.max = dtStr;
}

//Function to add the book slot
function addBookSlot(e) {
    e.preventDefault();
    bc++;
    if (bc > 3) {
        bc = 3;
        return alert("Maximum limit reached !!");
    }
    bcount.textContent = bc;

    books[bc].classList.remove("hide");
    books[bc].querySelector(`.book${bc} .name-box input`).required = true;
    books[bc].querySelector(`.book${bc} .date-box input`).required = true;
    books[bc].querySelector(`.book${bc} .name-box input`).name = "bname" + bc;
    books[bc].querySelector(`.book${bc} .date-box input`).name = "bdate" + bc;
    books[bc].querySelector(`.book${bc} .hidden-inputs`).name = "bdue" + bc;
    setTodayDate(bc);
}

//Function to remove the book slot
function removeBookSlot(e) {
    e.preventDefault();
    if (bc == 1) {
        return alert("Minimum limit reached !!");
    }
    books[bc].classList.add("hide");
    books[bc].querySelector(`.book${bc} .name-box input`).required = false;
    books[bc].querySelector(`.book${bc} .date-box input`).required = false;
    books[bc].querySelector(`.book${bc} .name-box input`).name = "";
    books[bc].querySelector(`.book${bc} .date-box input`).name = "";
    bc--;
    bcount.textContent = bc;
}

//Function to show the confirm-popup-box
function showConfirmBox(e) {
    if (form.checkValidity()) {
        bldcfm();
        confirm.style.transform = "scale(1)";
        confirm.style.transitionDelay = "0s";
        conbox.style.transform = "scale(1)";
    }
    document.querySelector("style").innerHTML = `input:invalid {
    border : red solid 1px !important;
    }`;
}

//Function to build the confirm-popup-box
function bldcfm() {
    document.querySelector(".name-data").textContent = document.querySelector(
        ".name-box input"
    ).value;
    document.querySelector(".email-data").textContent = document.querySelector(
        ".mail-box input"
    ).value;
    bcounthid.value = bc;
    for (let i = 1; i <= bc; i++) {
        let dt = books[i].querySelector(".date-box input").value;
        let d = new Date(dt);
        dt = `${(d.getDate()+"").padStart(2,"0")}-${(d.getMonth()+1+"").padStart(2,"0")}-${(d.getFullYear()+"").padStart(2,"0")}`;
        let t = d;
        t.setDate(t.getDate() + 15);
        let newdate = `${(t.getDate()+"").padStart(2,"0")}-${(t.getMonth()+1+"").padStart(2,"0")}-${(t.getFullYear()+"").padStart(2,"0")}`;
        books[i].querySelector(".hidden-inputs").value =  `${
            t.getFullYear() + ""
        }-${(t.getMonth() + 1 + "").padStart(2, "0")}-${(
            t.getDate() + ""
        ).padStart(2, "0")}`;
        confirm.querySelector(".confirm").insertAdjacentHTML(
            "beforeend",
            ` <div class="book-det book-name">${i}) ${
                books[i].querySelector(".name-box input").value
            }</div>
        <div class="book-det start">Date taken &nbsp;&nbsp;:</div>
        <div class="book-det start-data">${dt}</div>
        <div class="book-det end">Return Date :</div>
        <div class="book-det end-data">${newdate}</div>`
        );
    }
}

//Function to hide the confirm-popup-box
function hideConfirmBox(e) {
    confirm.style.transform = "scale(0)";
    confirm.style.transitionDelay = ".2s";
    conbox.style.transform = "scale(0)";
    setTimeout(() => {
        const bookdet = document.querySelectorAll(".book-det");
        for (let i = 0; i < bookdet.length; i++) {
            bookdet[i].remove();
        }
    }, 200);
}

function submitForm() {
    form.removeEventListener("submit", blockForm);
    submit.removeEventListener("click", showConfirmBox);
    submit.click();
    // window.open("https://www.google.com", "_blank")http://127.0.0.1:5500/success.html?name=Denis+Raja+M&email=denismrd93%40gmail.com
}

function blockForm(e) {
    e.preventDefault();
}

//------------------Setting up event listeners------------------

plus.addEventListener("click", addBookSlot); //When "+" button is clicked

minus.addEventListener("click", removeBookSlot); //When "-" button is clicked

form.addEventListener("submit", blockForm); //Prevent form from being submitted when "Submit" button is clicked

submit.addEventListener("click", showConfirmBox); //When "Submit" button is clicked

document.querySelector(".edit").addEventListener("click", hideConfirmBox); //When "Edit" button is clicked

document.querySelector(".con").onclick = submitForm; //When "Confirm" button is clicked

document.querySelector(".roll-no input").addEventListener("change", (e)=>{e.currentTarget.value=e.currentTarget.value.toUpperCase()})
