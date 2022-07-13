import * as fs from 'fs';
import {lexeme} from "./lexeme.js";
export function parser(tokens) {
    var idArr = []; //try lang
    let token = null;
    const rawTokens = [];

    function next(mode) {
        token = tokens.next(mode);
        if (!token) {
            // fs.appendFileSync('dump.txt',"\nnext token is undefined");
            return next(mode);
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
        let data = `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}\n`;
        fs.appendFileSync('parserError', data);
    }

    function lexMessage(message) {
        let data = `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}\n`;
        fs.appendFileSync('lexerror.txt', data);
    }

    function semError(message) {
        let data = `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}\n`;
        fs.appendFileSync('semErr', data);
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
                // end: close.loc.start,
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
            token.token === "String" ||
            token.token === "RegExpToken" ||
            token.token === "PlusToken" ||
            token.token === "MinusToken" ||
            token.token === "DivToken" ||
            token.token === "MultiplyToken" ||
            token.token === "Semicolon" ||
            token.token === "NumericLiteral"
        ) {
            const _token = token;
            next();
            return _token;
        }

        // if(token.token === "NumericLiteral"){
        //     const _token = token;
        //     next();
        //     return _token;
        // }

        return null;
    }

    function ExpressionMemberMust() {
        const next = ExpressionMember();
        if (!next) {
            panic(`Expected ExpressionMember got "${token.token}"`);
        }
        return next;
    }

    function take(type, mode) {
        if (token.token === type) {
            const _token = token;
            next(mode);
            return _token;
        }

        if(token.token === "Id" && type === "Semicolon"){
            lexMessage(`Lexical Error: Illegal Variable Declaration`);
        }
        else{
            panic(`Expected token type "${type}" got "${token.token}"`); //DITO KA MAGFOCUS RIGHT NOW

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

        // return EqualExpression(MinusExpression(PlusExpression(MulExpression(head))));
        return EqualExpression(MulExpression(head));

    }



    function EqualExpression(left) {
        const op = EqualToken();
        if (!op) return left;
        const next = ExpressionMemberMust();

        const right = MulExpression(next);

        // if(left.token === 'Id'){
        //     declaredVar.push(left.lexeme)
        //     declaredVar.push(left.token)
        // }

        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right: right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                // end: right.loc.end,
            },
        };

        const idTemp = {
            lexeme: left.lexeme,
            token: right.token,
        }

        idArr.push(idTemp);

        return EqualExpression(node);
    }

    // function UndeclaredID(){
    //     if(id)
    // }

    function MulExpression(left) {
        const op = MultiplyToken() || DivToken() || PlusToken() || MinusToken();
        if (!op) return left;
        const right = ExpressionMemberMust();

        const node = {
            token: "BinaryExpression",
            left,
            operatorToken: op,
            right: right,
            loc: {
                file: op.loc.file,
                start: left.loc.start,
                // end: right.loc.end,
            },
        };
        MulExpression.apply(this,idArr.lexeme)
        if(left.token !== right.token && left.token !== "BinaryExpression"){
                if (left.token === "Id") {
                    for (let i = 0; i < idArr.length; i++) {
                        if (idArr[i].lexeme === left.lexeme) {
                            if (idArr[i].token === right.token) {
                                return MulExpression(node);
                            }
                        }
                    }
                    semError(`"Undefined variable "${left.lexeme}"`)
                }
                semError('Semantic Error: Data Type Mismatch');
        }

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
                // end: close.loc.start,
            },
        };
    }

    function IfStatement() {
        //kw is for keyword
        const args = []
        const kw = maybeTake("if");
        if (!kw) return null;
        const open = take("OpenParent", "expression");
        if(open){
            args.push(open)
        }
        const id = maybeTake("Id")
        if(id){
            args.push(id)
        }

        // const condition = Expression();
        // if (!condition) {
        //     panic("Expected an Expression for condition");
        // }else {
        //     args.push(condition)
        // }

        const equal = maybeTake("EqualToken");
        if(equal){
            args.push(equal)
        }

        const greater = maybeTake("GreaterThanToken")
        if(greater){
            args.push(greater)
            const num = take("NumericLiteral")
            args.push(num)
            if(!num){
                const id = take("Id")
                args.push(id)
            }
        }
        const less = maybeTake("LessThanToken")
        if(less){
            args.push(less)
            const num = take("NumericLiteral")
            args.push(num)
            if(!num){
                const id = take("Id")
                args.push(id)
            }
        }
        const close = take("CloseParent")
        if(!close){
            panic("Missing semicolon")
        }else{
            args.push(close)
        }
        const then = Block() || Statement();
        args.push(then)
        if (!then) {
            panic("Expected a block/statement for if statement");
        }
        // const close = take("CloseParent", "expression");
        // args.push(close)
        // const then = Block() || Statement();
        // if (!then) {
        //     panic("Expected an Expression");
        // }else{
        //     args.push(then)
        // }
        // const body = Block()
        // if(!body){
        //     panic("Expected a block/statement for the if statement")
        // }
        const elf = maybeTake("else if")
        if(elf){
            args.push(elf)
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
                args.push(greater)
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const less = maybeTake("LessThanToken")
            if(less){
                args.push(less)
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const equal =  maybeTake("EqualToken")
            if(equal){
                args.push(equal)
                const num = take("NumericLiteral")
                args.push(num)
                if(!num){
                    const id = take("Id")
                    args.push(id)
                }
            }
            const close = take("CloseParent")
            if(!close){
                panic("Missing semicolon")
            }else{
                args.push(close)
            }
            const then = Block() || Statement();
            args.push(then)
            if (!then) {
                panic("Expected a block/statement for the if statement");
            }
        }
        // let el = null;
        const elseKw = maybeTake("else", "expression");
        if (elseKw) {
            args.push(elseKw);
            const body = Block() || Statement()
            if(!body){
                panic("Expected a block/statement for the if statement")
            }

        }

        // const end = elf ? elf.loc.end : then.loc.end;
        // return args;
        return {
            token: "If",
            args,
            // condition,
            then,
            else: elf,
            loc: {
                file: kw.loc.file,
                start: kw.loc.start,
                // end,
            },
        };
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
        }

        return {
            token: "FunctionStatement",
            name,
            args,
            body,
            loc: {
                file: kw.loc.file,
                start: kw.loc.start,
                // end: body.loc.end,
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
        }


        return {
            type: "For Loop Statement",
            args,
            body,
            loc: {
                file: kw.loc.file,
                start: kw.loc.start,
                // end: body.loc.end,
            },
        };
    }

    function Statement() {
        const expression = Expression();
        if (expression) {
            const sc = take("Semicolon", "expression");
            // if(sc){
            //     return sc;
            // }
            return {
                token: "Statement",
                expression,
                loc: {
                    file: expression.loc.file,
                    start: expression.loc.start,
                    // end: expression.loc.end,
                },
            };

        }

        const ifstmt = IfStatement();
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
            if (!stmt) break;
            stmts.push(stmt);
        }
        return stmts;
    }

    next("expression");
    const ast = Statements();

    // @ts-ignore
    if (token.token != "EndOfFileToken") {
        panic(`Expected token type "EndOfFileToken" got "${token.token}"`);
    }

    return { ast, tokens: rawTokens };
}