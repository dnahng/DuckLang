import { appendFileSync } from 'fs'
// import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


export function parser(tokens) {
    let trash = false;
    let broot = false; //brotforce code LOLOLOL..idk what it does anymore maybe remove
    let err_mode = "none"; //TODO will use for lex_error or syn_error or sem_error mode
    let token = null;
    const rawTokens = [];

    function next(mode) {

        //trash false if next code line
        if (broot===false) {
            broot = false;
            token = tokens.next(mode);
        }
        if (trash===true || token.token === "trash") {
            //loop and trash the token until you get to end of scope/line or EOF
            while (token.token !== "Newline" || token.token !== "EndOfFileToken" && trash===true || token.token === "trash") {
                //needed the if for the else lol
                if (trash === true || token.token === "trash"
                    && token.token !== "Newline" && token.token !=="EndOfFileToken") {
                    if(token.token!=="Newline") {
                        //enter and throw trash away
                        token = tokens.next(mode); //gets next possibly legitimate variable
                        broot = true; //dont enter lexer again}
                    }else { //dont throw trash, broot = false so it goes next to take legitimate token
                        trash = false;
                        break;
                        // return next(mode); //after trash thrown; start again
                    }
                }else { //dont throw trash, broot = false so it goes next to take legitimate token
                    trash = false;
                    break;
                    // return next(mode); //after trash thrown; start again
                }
            }
        }
        broot = false; //may now enter lexer again
        if (!token) {
            throw new TypeError("next token is undefined");
        }
        rawTokens.push(token);
        if (
            token.token === "CommentToken" ||
            token.token === "Whitespace" ||
            token.token === "Newline"
        ) {
            return next(mode);
        }
        // console.log("parser: ", token && token.type);
    }

    function panic(message) {
        trash = true;
        const erwrong = `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}\n`;
        try {
            String(appendFileSync("./lexerror.txt", erwrong));
        } catch (err) {
            console.log("File not found");
        }
        //TODO will do this when specified
        // if(err_mode==="lex_err") {
        //     try {
        //         String(appendFileSync("./lexerror.txt", erwrong));
        //     } catch (err) {
        //         console.log("File not found");
        //     }
        // }
        // else if(err_mode==="syn_err") {
        //     try {
        //         String(appendFileSync("./syntax_err.txt", erwrong));
        //     } catch (err) {
        //         console.log("File not found");
        //     }
        // }
        // else if(err_mode==="sem_err") {
        //     try {
        //         String(appendFileSync("./semantic_err.txt", erwrong));
        //     } catch (err) {
        //         console.log("File not found");
        //     }
        // }
        if (token.token === "Newline" || token.token === "EndOfFileToken") //trash any input until next line or end
            trash = false;
    }

    function FunctionCall(name) {
        const open = maybeTake("OpenParent", "expression");
        if (!open) return name;

        const args = [];

        // head
        const expr = Expression();
        if (expr) {
            args.push(expr);
            for (;;) {
                const colon = maybeTake("Colon", "expression");
                if (!colon) break;
                const expr = Expression();
                args.push(expr);
            }
        }

        const close = take("CloseParent");

        return {
            token: "FunctionCall",
            name,
            arguments: args,
            loc: {
                file: open.loc.file,
                start: open.loc.start,
                end: close.loc.start,
            },
        };
    }

    function ExpressionMember() {
        if (token.token === "Id") {
            const _token = token;
            next();
            return FunctionCall(_token);
        }
        if(token.token === "output"){
            const _token = token;
            next();
            return FunctionCall(_token);
        }

        if(token.token === "prompt"){
            const _token = token;
            next();
            return FunctionCall(_token);
        }

        if (
            token.token === "NumericLiteral" ||
            token.token === "String" ||
            token.token === "RegExpToken"
        ) {
            const _token = token;
            next();
            return _token;
        }

        return null;
    }

    function ExpressionMemberMust() {
        const next = ExpressionMember();
        if (!next) {
            panic(`Expected ExpressionMember got "${token.token}"`);
        }
        return next;
    }

    function take(type, mode) { //todo the one that throws error
        if (token.token === type) {
            const _token = token;
            next(mode);
            return _token;
        }
        //TODO mode maybe syntaxerr
        panic(`Expected token type "${type}" got "${token.token}"`);
        if(trash===true)
        {
            const _token = token;
            next(mode);
            return _token;
        }
    }

    function maybeTake(type, mode) {
        if (token.token === type) {
            const _token = token;
            next(mode);
            return _token;
        }

        return null;
    }

    function PlusToken() {
        if (token.token === "PlusToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }

    function MinusToken() {
        if (token.token === "MinusToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }

    function EqualToken() {
        if (token.token === "EqualToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }

    function MultiplyToken() {
        if (token.token === "MultiplyToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }

    function DivToken() {
        if (token.token === "DivToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }




    function Expression() {
        return BinaryExpression();
    }
    function BinaryExpression() {
        const head = ExpressionMember();
        if (!head) return null;

        return EqualExpression(MinusExpression(PlusExpression(MulExpression(head))));

    }

    function PlusExpression(left) {
        const op = PlusToken();
        if (!op) return left;
        const next = ExpressionMemberMust();

        const right = PlusExpression(next);

        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right: right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                end: right.loc.end,
            },
        };

        return PlusExpression(node);
    }

    function EqualExpression(left) {
        const op = EqualToken();
        if (!op) return left;
        const next = ExpressionMemberMust();

        // magic!!!
        const right = MulExpression(next);

        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right: right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                end: right.loc.end,
            },
        };

        return EqualExpression(node);
    }


    function MinusExpression(left) {
        const op = PlusToken() || MinusToken();
        if (!op) return left;
        const next = ExpressionMemberMust();

        // magic!!!
        const right = ExpressionMemberMust(); //takes the right of - or somehting


        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right: right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                end: right.loc.end,
            },
        };

        return MinusExpression(node);
    }

    function MulExpression(left) {
        const op = MultiplyToken() || DivToken();
        if (!op) return left; //left may pertain to 9 or some number; else multiply token
        const right = ExpressionMemberMust(); //takes the right of * or somehting

        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                end: right.loc.end,
            },
        };

        return MulExpression(node);
    }

    function Block() {
        const open = maybeTake("OpenCurly", "expression");
        if (!open) return null;
        const body = Statements();
        const close = take("CloseCurly", "expression");

        return {
            token: "Block",
            body,
            loc: {
                file: open.loc.file,
                start: open.loc.start,
                end: close.loc.start,
            },
        };
    }

    function IfStatement() {
        //kw is for keyword
        
        const args = []
        const kw = maybeTake("if");
        if (!kw) return null;
        take("OpenParent", "expression")
        //todo my got, bruteforce code
        if(trash===true)
        {
            trash = true;
            return next();
            return null; //lol
        }
        const condition = Expression();
        if (!condition) {
            panic("Expected an Expression for condition"); //semantic? no
        }
        const greater = maybeTake("GreaterThanToken")
        if(greater){
            const num = take("NumericLiteral")
            args.push(num)
            if(!num){
                const id = take("Id")
                args.push(id)
            }
        }
        const less = maybeTake("LessThanToken")
        if(less){
            const num = take("NumericLiteral")
            args.push(num)
            if(!num){
                const id = take("Id")
                args.push(id)
            }
        }
        take("CloseParent", "expression");
        const then = Block() || Statement();
        if (!then) {
            panic("Expected an Expression for then");
        }
        // const body = Block()
        // if(!body){
        //     panic("Expected a block/statement for the if statement")
        // }
        const elf = maybeTake("else if")
        if(elf && trash!==true){
            const open = take("OpenParent")
            args.push(open)
            const num = maybeTake("NumericLiteral")
            args.push(num)
            if(!num){
                const id = take("Id")
                args.push(id)
            }
            const greater = maybeTake("GreaterThanToken")
            if(greater){
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const less = maybeTake("LessThanToken")
            if(less){
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const equal =  maybeTake("EqualToken")
            if(equal){
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const close = take("CloseParent")
            args.push(close)
            const then = Block() || Statement();
            if (!then) {
                panic("Expected an Expression for then");
            }
        }
        // let el = null;
        const elseKw = maybeTake("else", "expression");
        if (elseKw) {
            args.push(elseKw);
            const body = Block() || Statement()
            if(!body){
                panic("Expected a block/statement for the if statement")
                trash = true;
            }

        }
        //todo NEED SALUHIN; done?
        if(trash===false) {
            const end = elf ? elf.loc.end : then.loc.end;
            return {
                token: "If",
                condition,
                then,
                else: elf,
                loc: {
                    file: kw.loc.file,
                    start: kw.loc.start,
                    end,
                },
            };
        }
    }

    function ArgumentList() {
        const args = [];
        take("OpenParent", "expression");

        // head
        const id = maybeTake("Id");
        if (id) {
            args.push(id);
        }

        for (;;) {
            const semicolon = maybeTake("Semicolon");
            const num = maybeTake("NumericLiteral");
            const equal = maybeTake("EqualToken")
            const lessthan = maybeTake("LessThanToken")
            const greaterthan = maybeTake("GreaterThanToken")
            const plus = maybeTake("PlusToken")
            if (semicolon) {
                const id = maybeTake("Id")
                args.push(id);
            } else if (num) {
                args.push(num);
                // const sem = take("Semicolon")
                // args.push("Semicolon")
            } else if (equal) {
                const number = maybeTake("NumericLiteral")
                args.push(number)
                if (!number) {
                    const id = take("Id")
                    args.push(id);
                }
            }else if(lessthan){
                const number = maybeTake("NumericLiteral")
                args.push(number)
                if (!number) {
                    const id = take("Id")
                    args.push(id);
                }
            } else if(greaterthan){
                const number = maybeTake("NumericLiteral")
                args.push(number)
                if (!number) {
                    const id = take("Id")
                    args.push(id);
                }
            } else if(plus){
                args.push(plus)
            }
            else {
                break;
            }

        }

        take("CloseParent");

        return args;
    }

    function FunctionStatement() {
        const kw = maybeTake("Function");
        if (!kw) return null;

        const name = take("Id");
        const args = ArgumentList();

        const body = Block();
        if (!body) {
            panic("Expected a Block for the function");
            trash = true;
        }

        return {
            token: "FunctionStatement",
            name,
            args,
            body,
            loc: {
                file: kw.loc.file,
                start: kw.loc.start,
                end: body.loc.end,
            },
        };
    }

    // LOOPING STATEMENT
    function FloopStatemenet() {
        const kw = maybeTake("for loop");
        if (!kw) return null;

        const args = ArgumentList();
        const body = Block() ;
        if (!body) {
            panic("Expected a Block for the function");
            trash = true;
        }

        if(trash!==true){
            return {
                type: "For Loop Statement",
                args,
                body,
                loc: {
                    file: kw.loc.file,
                    start: kw.loc.start,
                    end: body.loc.end,
                },
            };
        }else{ //TODO remove; not sure abt this else
            return next();
        }
    }

    function Statement() {
        const expression = Expression();
        if (expression) {
            const sc = take("Semicolon", "expression");
            if(trash===false) {
                return {
                    token: "Statement",
                    expression,
                    loc: {
                        file: expression.loc.file,
                        start: expression.loc.start,
                        end: sc.loc.end,
                    },
                };
            }else {            return next();
            }
        }

        const ifstmt = IfStatement();
        if (trash === true) //todo IF TRASH GO NEXT
        {
            return null;
            // if (
            //     token.token === "CommentToken" ||
            //     token.token === "Whitespace" ||
            //     token.token === "Newline"
            // ) {
            //     return next(mode);
            // }
        }
        if (ifstmt) {
            maybeTake("Semicolon", "expression");
            return ifstmt;
        }

        const fnstmt = FunctionStatement();
        if (fnstmt) {
            return fnstmt;
        }

        const floopstmt = FloopStatemenet();
        if(floopstmt){
            return floopstmt;
        }

        return null;
    }

    function Statements() {
        const stmts = [];
        for (;;) {
            const stmt = Statement();
            // if (!stmt) break;
            if (!stmt) break;
            stmts.push(stmt);
        }
        return stmts;
    }

    next("expression");
    const ast = Statements();

    // @ts-ignore
    if(!Statements())
        return next();
    if (token.token != "EndOfFileToken") {
        panic(`Expected token type "EndOfFileToken" got "${token.token}"`);

    }

    return { ast, tokens: rawTokens };
}
