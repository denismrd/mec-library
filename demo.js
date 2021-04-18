

let arr = [1,2,2,3,4,2]
for(let i of arr) {
    if(i==2) {
        arr.splice(arr.indexOf(i),1)
    }
    console.log(i)
}
console.log(arr)