const rows = document.querySelectorAll("tr");
const red = `<img src="/vier-op-een-rij/img/download-removebg-preview.png">`;
const yellow = `<img src="/vier-op-een-rij/img/images-removebg-preview (1).png">`;


for (let i = 0; i < rows.length; i++) {
    let table = '';
    for (let j = 0; j < 7; j++) {
        table += red;
    }
    rows[i].innerHTML = table;
}