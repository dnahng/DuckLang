
// const input = "";
//
// function* lexer(str) {
//
//
//     for (let cursor = 0; cursor <= str.length; cursor++) {
//         let char = str[cursor];
//
//         function number(){
//             let value = "";
//             for(; cursor <= str.length; cursor++) {
//                 char = str[cursor];
//                 if (char === '7') {
//                     value += char;
//                 } else {
//                     break;
//                 }
//             }
//             return {
//                 type: "number",
//                 value,
//             };
//         }
//
//         if (char === "7"){
//             yield number();
//         } else if (char === undefined){
//             yield {
//                 type: 'EOF',
//             }
//         } else {
//             throw new SyntaxError(`unexpected character "${char}" at ${cursor + 1}"`)
//         }
//     }
// }
// console.log("start");
// for(const token of lexer(input)){
//     console.log(token)
// }
//
// console.log("finish");

// const fs = require('fs');
//
// let data = fs.readFileSync('source-code.rtf', 'utf-8');
// // for (const ch of data){
// //     console.log(ch)
// // }
//
// console.log(data)
//
const input = "(";

const KEYWORDS = {
    if : 'keyword',
    el : 'keyword',
    elf : 'keyword',
    show : 'keyword',
    shown : 'keyword',
    inp : 'keyword',
    '(' : 'open-parenthesis',
    ')' : 'close-parenthesis',
}

//trial - isa lang gumagana na lexeme
function lexer(str) {
    let arr = str.split(' ');
    let size = Object.keys(KEYWORDS).length

    for (let i = 0; i < size; i++) {
        let propertyNames = Object.keys(KEYWORDS)[i];
        let propertyValues = Object.values(KEYWORDS)[i];
        for (let index = 0; index < arr.length; index++) {
            if (arr[index] === propertyNames) {
                return {
                    lexeme: propertyNames,
                    type: propertyValues,
                };
            }
        }
    }
}


console.log(lexer(input))

// const input = "if elf else"
// const lexer = (str) =>
//     str
//         .split(" ")
//         .map((s) => s.trim())
//         .filter((s) => s.length);
//
// console.log(lexer(input)) // outputs ["John" , "Doe"]

