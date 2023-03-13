let str = "abcdefghijklmnopqrstuvwxyz";
let ran_str = "";

for(let i=1 ; i<=5 ;i++){
    let random = Math.floor(Math.random()*(26-1) + 1) ;
    console.log(random);
    ran_str += str.charAt(random)
}

console.log(ran_str);