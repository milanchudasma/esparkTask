let flag = 0 ;
let cell = document.querySelectorAll("td");
let current = "X" ; 


// flag methd 
// cell.forEach((i)=>{
//     i.addEventListener("click" , (j)=>{
//         if(flag == 0 && i.innerHTML == ""){
//             i.innerHTML = 'X';
//             flag = 1 ;
//         }
//         else if(i.innerHTML == ""){
//             i.innerHTML = "0";
//             flag = 0 ;
//         }
//     })
// })

cell.forEach((i)=>{
    i.addEventListener("click" ,(j)=>{
        if(i.innerText != "") return ;
        i.innerText = current ;
        current = current =="X" ? "0" : "X";
        i.style.backgroundColor  = "red" ;
        // checkwin() ;

    })
})

let mln_count = 0;
let mln_checkwin = 0;
let mln_counter_X = 0;
let mln_counter_O = 0;
let mln_total = 9;

const mln_table = document.querySelector("table");
const mln_td = mln_table.querySelectorAll("td");

mln_td.forEach((temp) => {
    temp.addEventListener("click", (e) => {
        if (document.querySelector("#" + e.target.id).innerHTML == "" && !checkwin) {
            if (mln_count) {
                
                document.querySelector("#" + e.target.id).innerHTML = "0";
                mln_count = 0;
                mln_total -= 1;
                
            } else {
                document.querySelector("#" + e.target.id).innerHTML = "X";
                mln_count = 1;
                mln_total -= 1;
                

            }
            result();
            if (!total && !checkwin) {
                alert('match drew!!!\n Please Restart Game.....')

            }

        }
    })
});

function result() {
    if (
        checker("cell1", "cell2", "cell3") ||
        checker("cell4", "cell5", "cell6") ||
        checker("cell7", "cell8", "cell9") ||
        checker("cell1", "cell4", "cell7") ||
        checker("cell2", "cell5", "cell8") ||
        checker("cell3", "cell6", "cell9") ||
        checker("cell1", "cell5", "cell9") ||
        checker("cell3", "cell2", "cell7")
    ) {
        if (count) {
            alert("player X is winner.....");
            mln_counter_X += 1;
            mln_checkwin = 1;
            
            // win ni value update karava mate 
            document.querySelector(".scoreX").innerHTML = mln_counter_X;
        } else {
            alert("player 0 is winner.....");
            mln_counter_O += 1;
            mln_checkwin = 1;
            
            // win ni value update karava mate 
            document.querySelector(".score0").innerHTML = mln_counter_O;
        }
    }
}

function checker(a, b, c) {
    if (
        helper(a) != "" &&
        helper(b) == helper(a) &&
        helper(b) == helper(c)

    )
        return true;
}

function reset() {
    // console.log("restrating");
    td.forEach((temp) => {
        temp.innerHTML = "";
        mln_checkwin = 0;
        mln_total = 9;
    })
}

document.querySelector("btn").addEventListener("click", reset());
function helper(temp) {
    return document.querySelector("#" + temp).innerHTML;
} 