// function isNumeric(c) {
//     return "0" <= c && c <= "9";
// }
//
// function isAlpha(c) {
//     return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
// }
//
// export function *lexer(file, str) {
//     let line = 1;
//     let column = 1;
//     let cursor = 0;
//     let char = str[cursor];
//
//     function position() {
//         return { cursor, line, column };
//     }
//
//     function next() {
//         cursor++;
//         char = str[cursor];
//         column++;
//     }
//
//     function newline() {
//         line++;
//         column = 1;
//     }
//
//     function stringOfType(delimiter) {
//         let buffer = "";
//         if (char !== delimiter) return null;
//
//         const start = position();
//         next();
//         while (char !== delimiter) {
//             buffer += char;
//             next();
//         }
//
//         next(); // last delimiter
//
//         const end = position();
//         return {
//             token: "String",
//             lexeme: buffer,
//             loc: { file, start, end },
//         };
//     }
//
//     function string() {
//         return stringOfType('"') || stringOfType("'");
//     }
//
//     function regexp() {
//         if (char === "/") {
//             const start = position();
//             next();
//             if (char === "/") {
//                 next();
//                 return readComment(start);
//             }
//
//             next();
//             while (char !== "/") {
//                 next();
//             }
//
//             next(); // last /
//
//             const end = position();
//             return {
//                 token: "RegExpToken",
//                 loc: { file, start, end },
//             };
//         }
//     }
//
//     function readComment(start) {
//         let buffer = "";
//         for (;;) {
//             if (char === "\n") {
//                 newline();
//                 next();
//                 break;
//             }
//
//             if (char === undefined) {
//                 break;
//             }
//             buffer += char;
//             next();
//         }
//
//         const end = position();
//
//         return {
//             token: "CommentToken",
//             lexeme: buffer,
//             loc: { file, start, end },
//         };
//     }
//
//     function operator() {
//         let buffer = "";
//         if (char === "+") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "PlusToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "*") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "MultiplyToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "/") {
//             buffer += char;
//             const start = position();
//             next();
//             if (char === "/") {
//                 next();
//                 return readComment(start);
//             }
//             const end = position();
//             return {
//                 token: "DivToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//         if (char === "-") {
//             buffer += char;
//             const start = position();
//             next();
//             if (char === "-") {
//                 next();
//                 return readComment(start);
//             }
//             const end = position();
//             return {
//                 token: "MinusToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "="){
//             buffer += char;
//             const start = position();
//             next();
//             if (char === "="){
//                 next();
//                 return readComment(start);
//
//             }
//             const end = position();
//             return {
//                 token: "EqualToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         //TEST FOR GREATER/LESS THAN
//         if (char === ">"){
//             buffer += char;
//             const start = position();
//             next();
//             if (char === ">"){
//                 next();
//                 return readComment(start);
//
//             }
//             const end = position();
//             return {
//                 token: "GreaterThanToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "<") {
//             buffer += char;
//             const start = position();
//             next();
//             if (char === "<") {
//                 next();
//                 return readComment(start);
//             }
//             const end = position();
//             return {
//                 token: "LessThanToken",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         return null;
//     }
//
//     function number() {
//         let buffer = "";
//         const start = position();
//         while (isNumeric(char)) {
//             buffer += char;
//             next();
//         }
//
//         if (buffer.length >= 1) {
//             const end = position();
//             return {
//                 token: "NumericLiteral",
//                 value: Number(buffer),
//                 loc: { file, start, end },
//             };
//         }
//
//         return null;
//     }
//
//     const KEYWORDS = {
//         if: "if",
//         elf:"else if",
//         el: "else",
//         while : "while loop",
//         show : "output",
//         //shown : "output\n",
//         floop :"for loop",
//         const : "constant",
//         inp : "prompt",
//         function: "Function",
//         do: "do-while loop",
//     };
//
//     function id() {
//         let buffer = "";
//         if (!isAlpha(char)) return null;
//         const start = position();
//         buffer += char;
//         next();
//
//         while (isNumeric(char) || isAlpha(char)) {
//             buffer += char;
//             next();
//         }
//
//         const end = position();
//
//         const token = KEYWORDS[buffer];
//         if (token) {
//             return {
//                 token,
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         return {
//             token: "Id",
//             lexeme: buffer,
//             loc: { file, start, end },
//         };
//
//         return null;
//     }
//
//     function isWhitespace(c) {
//         return c === " " || c === "\t";
//     }
//
//     function semicolon() {
//         let buffer = "";
//         if (char !== ";") return null;
//         const start = position();
//         buffer += char;
//         next();
//
//         const end = position();
//
//         return {
//             token: "Semicolon",
//             lexeme: buffer,
//             loc: { file, start, end },
//         };
//     }
//
//
//     function parents() {
//         let buffer = "";
//         if (char === "(") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "OpenParent",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === ")") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "CloseParent",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "{") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "OpenCurly",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         if (char === "}") {
//             buffer += char;
//             const start = position();
//             next();
//             const end = position();
//             return {
//                 token: "CloseCurly",
//                 lexeme: buffer,
//                 loc: { file, start, end },
//             };
//         }
//
//         return null;
//     }
//
//     function whitespace() {
//         const start = position();
//         if (!isWhitespace(char)) {
//             return null;
//         }
//         next();
//
//         while (isWhitespace(char)) {
//             next();
//         }
//         const end = position();
//
//         return {
//             token: "Whitespace",
//             loc: { file, start, end },
//         };
//     }
//
//     function eol() {
//         const start = position();
//
//         if (char !== "\n") {
//             return null;
//         }
//
//         next();
//         newline();
//
//         const end = position();
//
//         return {
//             token: "Newline",
//             loc: { file, start, end },
//         };
//     }
//
//     function eof() {
//         if (char === undefined) {
//             const start = position();
//             const end = start;
//             return {
//                 token: "EndOfFileToken",
//                 loc: { file, start, end },
//             };
//         }
//
//         return null;
//     }
//
//     // function next2(mode) {
//     //     function value() {
//     //         return number() || string() || regexp();
//     //     }
//     //
//     //     const token =
//     //         whitespace() ||
//     //         id() ||
//     //         semicolon() ||
//     //         parents() ||
//     //         number() ||
//     //         (mode === "expression" ? value() : operator()) ||
//     //         eol();
//     //
//     //     if (token) {
//     //         return token;
//     //     }
//     //
//     //     const maybeEof = eof();
//     //     if (maybeEof) {
//     //         return maybeEof;
//     //     }
//     //
//     //     throw new SyntaxError(
//     //         `unexpected character "${char}" at ${file}:${line}:${column}`
//     //     );
//     // }
//
//     // return {
//     //     next: next2,
//     // };
//
//     for (; ;) {
//         // whitespace();
//         let buffer = "";
//         const token =
//             whitespace() ||
//             id() ||
//             semicolon() ||
//             parents() ||
//             string() ||
//             number() ||
//             operator() ||
//             regexp()
//         eol();
//         //
//         // if (token) {
//         //     return token;
//         // }
//         // if (token) {
//         //     if (token === true) {
//         //         continue;
//         //     }
//         //
//         //     yield token;
//         //
//         //
//         // }
//
//         // const maybeEof = eof()
//         // if (maybeEof) {
//         //     break;
//         //     // return maybeEof;
//         // }
//
//         class Error{
//             constructor(ErrorMessage) {
//                 this.ErrorMessage = ErrorMessage;
//                 this.typeOfError = "Error";
//                 // this.stack = c
//             }
//         }
//
//         class LexicalError extends Error{
//             constructor(ErrorMessage) {
//                 super(ErrorMessage);
//                 this.typeOfError = "LexicalError";
//             }
//         }
//
//         if (buffer !== token) {
//             throw new LexicalError(
//                 `unexpected character "${buffer}" at ${file}:${line}:${column}`
//             );
//         }
//
//
//     }
// }

function isNumeric(c) {
    return "0" <= c && c <= "9";
}

function isAlpha(c) {
    return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
}

export function lexer(file, str) {
    let line = 1;
    let column = 1;
    let cursor = 0;
    let char = str[cursor];

    function position() {
        return {cursor, line, column};
    }

    function next() {
        cursor++;
        char = str[cursor];
        column++;
    }

    function newline() {
        line++;
        column = 1;
    }

    function stringOfType(delimiter) {
        let buffer = "";
        if (char !== delimiter) return null;

        const start = position();
        next();
        while (char !== delimiter) {
            buffer += char;
            next();
        }

        next(); // last delimiter

        const end = position();
        return {
            token: "String",
            lexeme: buffer,
            loc: {file, start, end},
        };
    }

    function string() {
        return stringOfType('"') || stringOfType("'");
    }

    function regexp() {
        if (char === "/") {
            const start = position();
            next();
            if (char === "/") {
                next();
                return readComment(start);
            }

            next();
            while (char !== "/") {
                next();
            }

            next(); // last /

            const end = position();
            return {
                token: "RegExpToken",
                loc: {file, start, end},
            };
        }
    }

    function readComment(start) {
        let buffer = "";
        for (; ;) {
            if (char === "\n") {
                newline();
                next();
                break;
            }

            if (char === undefined) {
                break;
            }
            buffer += char;
            next();
        }

        const end = position();

        return {
            token: "CommentToken",
            lexeme: buffer,
            loc: {file, start, end},
        };
    }

    function operator() {
        let buffer = "";
        if (char === "+") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "PlusToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "*") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "MultiplyToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "/") {
            buffer += char;
            const start = position();
            next();
            if (char === "/") {
                next();
                return readComment(start);
            }
            const end = position();
            return {
                token: "DivToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }
        if (char === "-") {
            buffer += char;
            const start = position();
            next();
            if (char === "-") {
                next();
                return readComment(start);
            }
            const end = position();
            return {
                token: "MinusToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "=") {
            buffer += char;
            const start = position();
            next();
            if (char === "=") {
                next();
                return readComment(start);

            }
            const end = position();
            return {
                token: "EqualToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        //TEST FOR GREATER/LESS THAN
        if (char === ">") {
            buffer += char;
            const start = position();
            next();
            if (char === ">") {
                next();
                return readComment(start);

            }
            const end = position();
            return {
                token: "GreaterThanToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "<") {
            buffer += char;
            const start = position();
            next();
            if (char === "<") {
                next();
                return readComment(start);
            }
            const end = position();
            return {
                token: "LessThanToken",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        return null;
    }

    function number() {
        let buffer = "";
        const start = position();
        while (isNumeric(char)) {
            buffer += char;
            next();
        }

        if (buffer.length >= 1) {
            const end = position();
            return {
                token: "NumericLiteral",
                value: Number(buffer),
                loc: {file, start, end},
            };
        }

        return null;
    }

    const KEYWORDS = {
        if: "if",
        elf: "else if",
        el: "else",
        while: "while loop",
        show: "output",
        //shown : "output\n",
        floop: "for loop",
        const: "constant",
        inp: "prompt",
        function: "Function",
        do: "do-while loop",
    };

    function id() {
        let buffer = "";
        if (!isAlpha(char)) return null;
        const start = position();
        buffer += char;
        next();

        while (isNumeric(char) || isAlpha(char)) {
            buffer += char;
            next();
        }

        const end = position();

        const token = KEYWORDS[buffer];
        if (token) {
            return {
                token,
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        return {
            token: "Id",
            lexeme: buffer,
            loc: {file, start, end},
        };

        return null;
    }

    function isWhitespace(c) {
        return c === " " || c === "\t";
    }

    function semicolon() {
        let buffer = "";
        if (char !== ";") return null;
        const start = position();
        buffer += char;
        next();

        const end = position();

        return {
            token: "Semicolon",
            lexeme: buffer,
            loc: {file, start, end},
        };
    }


    function parents() {
        let buffer = "";
        if (char === "(") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "OpenParent",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === ")") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "CloseParent",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "{") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "OpenCurly",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        if (char === "}") {
            buffer += char;
            const start = position();
            next();
            const end = position();
            return {
                token: "CloseCurly",
                lexeme: buffer,
                loc: {file, start, end},
            };
        }

        return null;
    }

    function whitespace() {
        const start = position();
        if (!isWhitespace(char)) {
            return null;
        }
        next();

        while (isWhitespace(char)) {
            next();
        }
        const end = position();

        return {
            token: "Whitespace",
            loc: {file, start, end},
        };
    }

    function eol() {
        const start = position();

        if (char !== "\n") {
            return null;
        }

        next();
        newline();

        const end = position();

        return {
            token: "Newline",
            loc: {file, start, end},
        };
    }

    function eof() {
        if (char === undefined) {
            const start = position();
            const end = start;
            return {
                token: "EndOfFileToken",
                loc: {file, start, end},
            };
        }

        return null;
    }

    function next2(mode) {
        function value() {
            return number() || string() || regexp();
        }

        class Error {
            constructor(ErrorMessage) {
                this.ErrorMessage = ErrorMessage;
                this.typeOfError = "Error";
                // this.stack = c
            }
        }

        class LexicalError extends Error {
            constructor(ErrorMessage) {
                super(ErrorMessage);
                this.typeOfError = "LexicalError";
            }
        }
        // class LexicalError2 extends Error{
        //     constructor(ErrorMessage) {
        //         super(ErrorMessage);
        //         this.typeOfError = "LexicalError2";
        //     }
        // }

        const token =
            whitespace() ||
            id() ||
            semicolon() ||
            parents() ||
            number() ||
            (mode === "expression" ? value() : operator()) ||
            eol() ||
            eof();

        if (token) {
            return token;
        }

        const maybeEof = eof();
        if (maybeEof) {
            return maybeEof;
        }

        function nextLine() {
            next();
            next2();
            newline();
            next2();
        }

        console.log(new LexicalError(`unexpected character "${char}" at ${file}:${line}:${column}`))
        nextLine();
    }


    return {
        next: next2,
    };

    // let token = null;
    // const rawTokens = [];
    //
    // function next(mode) {
    //     token = tokens.next(mode);
    //     if (!token) {
    //         throw new TypeError("next token is undefined");
    //     }
    //     rawTokens.push(token);
    //     if (
    //         token.token === "CommentToken" ||
    //         token.token === "Whitespace" ||
    //         token.token === "Newline"
    //     ) {
    //         return next(mode);
    //     }
        // console.log("parser: ", token && token.type);
    // }


}
