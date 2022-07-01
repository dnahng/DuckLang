import { readFileSync } from 'fs'
import { lexer } from "./lexer.js"

const file = "./source.txt";

const input = String(readFileSync(file));
const prompt = require('prompt-sync')();
let ans;
do{
    console.log("MAIN MENU: ");
    console.log("1: Upload Text File");
    console.log("2: View Lexemes/Token");
    console.log("3: View Lexical Errors");
    console.log("4: View Syntax Error");
    console.log("5: View Semantic Error");
    console.log("6: Exit Program");
    ans = prompt("Please input your choice: ");

    switch(ans){
        case 1:
            break;
        case 2:
            console.log("start");

            for(const token of lexer(file, input)){
                console.log(token);
            }

            console.log('finish');
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            console.log("You have exited the program");

            break;
        default:
            console.log("Invalid input, please try again");
            break;
    }
    console.log("Do you want")
}while (ans !== 6);

// read file
// console.log("start");
//
// for(const token of lexer(file, input)){
//     console.log(token);
// }
//
// console.log('finish');