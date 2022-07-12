import { readFileSync } from 'fs'
import { lexer } from "./lexer.js"
import { parser } from "./parser.js"
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import pressAnyKey from 'press-any-key';

//functions
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const lexFile = "./dump.txt";
let file = "./source.txt";
import f from "fs";
import path from "path";

let file_input = String(readFileSync(file));
const rl = readline.createInterface({ input, output });
let ans;

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
    // ans = await rl.question('Please input your choice: ');
    //todo only for testing
    let ans = "2";
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
            console.log("--START--");
            const { ast, tokens } = parser(lexer(file, file_input));
            console.dir(ast, { depth: null });

            // console.log(highlight(content, tokens));

            console.log('--FINISH--');
            // console.log("press any key to go back to menu")

            await rl.question("Press Enter to return to Menu");
            // await delay(5000);
            console.log("you have returned");
            break;
        case '3':
            console.log(String(readFileSync(lexFile)))
            await delay(4000);
            break;
        case '4':
            break;
        case '5':
            break;
        case '6':
            console.log("You have exited the program");
            break;
        default:
            console.log("Invalid input, please try again");
            break;
    }
}while (ans !== '6');
rl.close();
