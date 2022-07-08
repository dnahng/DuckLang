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

// KEY PRESS FUNCS, DITO MUNA WILL RESOLVENNALANG LATER
// const keypress = async () => {
//     process.stdin.setRawMode(true)
//     return new Promise(resolve => process.stdin.once('data', () => {
//         process.stdin.setRawMode(false)
//         resolve()
//     }))
// }


// function keyPress(message, keys) {
//     const _message = message || "Press any key to continue...";
//     const _keys = keys || "";
//     return new Promise(function (resolve, reject) {
//         const caseSensitive = _keys.toLowerCase() !== _keys && _keys.toUpperCase() !== _keys;
//         process.stdout.write(_message);
//         function keyListener(buffer) {
//             let key = buffer.toString();
//             if (key.charCodeAt(0) === 3) {
//                 process.stdin.setRawMode(false);
//                 process.stdin.off('data', keyListener);
//                 process.stdin.pause();
//                 // process.exit(0); // Exit process if you prefer.
//                 reject(key.charCodeAt(0));
//             }
//             const index = caseSensitive ? _keys.indexOf(key) : _keys.toLowerCase().indexOf(key.toLowerCase());
//             if (_keys && index < 0) {
//                 process.stdout.write(key);
//                 process.stdout.write("\n");
//                 process.stdout.write(_message);
//                 return;
//             }
//             process.stdin.setRawMode(false);
//             process.stdin.off('data', keyListener);
//             process.stdin.pause();
//             if (index >= 0) {
//                 key = _keys.charAt(index);
//                 process.stdout.write(key);
//             }
//             process.stdout.write("\n");
//             resolve(key);
//         }
//         process.stdin.resume();
//         process.stdin.setRawMode(true);
//         process.stdin.on('data', keyListener);
//     });
// }

//var declaration
const lexFile = "./dump.txt";
let file = "./source.txt";
import f from "fs";
import path from "path";

let file_input = String(readFileSync(file));
const rl = readline.createInterface({ input, output });


// const pressAnyKey = require('press-any-key');
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

    //chan2ged ans from int to string since JS gaming :)
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

            //changed bc it deletes file in directory
            // f.rename(currentPath, newPath, function(err) {
            //     if (err) {
            //         throw err
            //     } else {
            //         console.log("\nSuccessfully uploaded the file!")
            //     }
            // })

            break;

        case '2':
            //TEST CODE
        //     ;(async () => {
        //
        //     console.log('program started, press any key to continue')
        //     await keypress()
        //     console.log('program still running, press any key to continue')
        //     await keypress()
        //     console.log('bye')
        //     process.stdin.pause();
        //
        // })().then(process.stdin.pause)

            console.log("2");
            console.log("--START--");
            // for (const token of parser(lexer(file, file_input))) {
            //     console.log(token);
            // }
            // const { ast, tokens } = parser(lexer(file, file_input));
            // console.dir(ast, { depth: null });

            for(const token of (lexer(file, file_input))){
                console.log(token);
            }
            // console.log(highlight(content, tokens));

            console.log('--FINISH--');
            // console.log("press any key to go back to menu")

            await rl.question("Press Enter to return to Menu");
            // await delay(5000);
            console.log("you have returned");
            break;
        case '3':
            // console.log(String(readFileSync(lexFile)))
            // await delay(4000);
            for(const token of lexer(file, file_input)){
                console.log(token)
            }
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


// read file
// console.log("start");
//
// for(const token of lexer(file, input)){
//     console.log(token);
// }
//
// console.log('finish');