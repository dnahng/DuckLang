import * as fs from 'fs';
export function parser(tokens) {
    let token = null;
    const rawTokens = [];

    function next(mode) {
        token = tokens.next(mode);
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
        throw new SyntaxError(
            // @ts-ignore
            `${message} at ${token.loc.file}:${token.loc.start.line}:${token.loc.start.column}`
        );
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

    function take(type, mode) {
        if (token.token === type) {
            const _token = token;
            next(mode);
            return _token;
        }

        panic(`Expected token type "${type}" got "${token.token}"`);
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

    function EqualToken() {
        if (token.type === "EqualToken") {
            const _token = token;
            next("expression");
            return _token;
        }

        return null;
    }

    // ASSIGNMENT OP FUNC
    // function AssignmentOp(left){
    //     const op = EqualToken();
    //     if(!op) return left;
    //     if(left.token !== 'Id') return null;
    //     const next = take('NumericLiteral');
    //     const right = ExpressionMemberMust();
    //     const node = {
    //         type: "EqualToken",
    //         left,
    //         operatorToken: op,
    //         right,
    //         loc: {
    //             file: op.loc.file,
    //             start: left.loc.start,
    //             end: right.loc.end,
    //         },
    //     }
    //     return AssignmentOp(node);
    // }


    function Expression() {
        return BinaryExpression();
    }
    function BinaryExpression() {
        const head = ExpressionMember();
        if (!head) return null;

        return PlusExpression(MulExpression(head));
    }
    function PlusExpression(left) {
        const op = PlusToken();
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

        return PlusExpression(node);
    }

    function MulExpression(left) {
        const op = MultiplyToken() || DivToken();
        if (!op) return left;
        const right = ExpressionMemberMust();

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
        take("OpenParent", "expression");
        const condition = Expression();
        if (!condition) {
            panic("Expected an Expression for condition");
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
        if(elf){
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
            }

        }

        const end = elf ? elf.loc.end : then.loc.end;
        // return args;
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
        }


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
    }

    function Statement() {
        const expression = Expression();
        if (expression) {
            const sc = take("Semicolon", "expression");
            return {
                token: "Statement",
                expression,
                loc: {
                    file: expression.loc.file,
                    start: expression.loc.start,
                    end: sc.loc.end,
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
