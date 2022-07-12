import { readFileSync } from 'fs'
import { lexeme } from "./lexeme.js"
import { parser } from "./parser.js"
// import {trial} from "./trial.js"
import * as fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';



//var declaration
const lexFile = "./dump.txt";
let file = "./source.txt";
let parserFile = "./parserError"
import f from "fs";
import path from "path";

let file_input = String(readFileSync(file));
const rl = readline.createInterface({ input, output });



let ans;

//menu
do{
    console.clear();
    console.log("MAIN MENU: ");
    console.log("1: Upload Text File");
    console.log("2: View Lexemes/Token");
    console.log("3: View Lexical Errors");
    console.log("4: View Syntax Error");
    console.log("5: View Semantic Error");
    console.log("6: Exit Program");
    // let ans = prompt("Please input your choice: ")  ;
    ans = await rl.question('Please input your choice: ');

    //changed ans from int to string since JS gaming :)
    switch(ans){
        case '1':
            console.log("1");
            //enter full file path
            let src =  await rl.question("Enter file path: ");
            const currentPath = path.join(src)
            //new file name
            file = path.join("./", currentPath);

            try {
                file_input = String(readFileSync(file));
                console.log("File successfully uploaded")
            }catch(err){
                console.log("File not found");
            }

            await rl.question("Press enter to go back to menu");

            break;

        case '2':
            fs.writeFileSync('lexerror.txt', '');
            fs.writeFileSync('parserError', '');
            console.log("2");
            console.log("--START--");
            // for (const token of parser(lexer(file, file_input))) {
            //     console.log(token);
            // }
            const { ast, tokens } = parser(lexeme(file, file_input));
            console.dir(ast, { depth: null });


            console.log('--FINISH--');

            await rl.question("Press Enter to return to Menu");
            console.log("you have returned");
            break;
        case '3':
            console.log("\n==Lexical Errors==")
            console.log(String(readFileSync('./lexerror.txt')));
            await rl.question("Press Enter to return to Menu");
            // await delay(4000);
            break;
        case '4':
            console.log("\n==Syntax Errors==");
            console.log(String(readFileSync(parserFile)))
            await rl.question("Press Enter to return to Menu");
            break;
        case '5':
            break;
        case '6':
            fs.writeFileSync('lexerror.txt', '');
            fs.writeFileSync('parserError', '');
            console.log("You have exited the program");
            break;
        default:
            console.log("Invalid input, please try again");
            await rl.question("Press Enter to return to Menu");
            break;
    }
}while (ans !== '6');
rl.close();


// read file
// console.log("start");
//
// for(const token of lexer(file, input)){
//     console.log(token);
// }
//
// console.log('finish');