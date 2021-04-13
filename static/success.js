let ar = new URLSearchParams(location.search);
let t = 1;
ar.forEach((val, key) => {
    if (t == 1) {
        document.querySelector(".content span").textContent = val;
    } else if (t % 2 == 0) {
        document
            .querySelector(".books")
            .insertAdjacentHTML(
                "beforeend",
                `<div class="name">${val}</div><div class="symbol">:</div>`
            );
    } else {
        let d = new Date(val);
        dt = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
        let t = d;
        t.setDate(t.getDate() + 15);
        let newdate = `${t.getDate()}-${t.getMonth() + 1}-${t.getFullYear()}`;
        document
            .querySelector(".books")
            .insertAdjacentHTML(
                "beforeend",
                `<div class="date">${newdate}</div>`
            );
    }
    t++;
});
