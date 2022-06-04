function isNumeric(c){
    return "0" <= c && c <= "9";
}


export function* lexer(file, str){

    let line = 1;
    let column = 1;
    let cursor = 0;
    let char = str[cursor];

    function next(){
        cursor++;
        char = str[cursor];
        // ??
        column++
    }

    function newline(){
        // for parser to identify which line has errors
        line++;
        column = 1;
    }

    function operator(){
        // let buffer = ""
        if (char === '+'){
            // buffer+=char;
            next();
            return {
                type: 'PlusToken',
                // lexeme: buffer,
            }; 
        }
        return null;
    }


    function number(){
        let buffer = "";
        while(isNumeric(char)){    
            buffer+=char;
            next();
        }

        if(buffer.length >= 1){
            return {
                type: 'NumericLiteral',
                value: Number(buffer),
            };
        }
        return null;
    }

    function isWhitespace(){
        return char === ' ' || char === "\t";
    }

    function whitespace(){
        if(isWhitespace(char)){
            next();
        }
        else{
            return null;
        }

        while(isWhitespace(char)){    
            next();
        }

        return true;
    }

    function eol(){
        if(char === '\n'){
            next();
            newline();
        }
        else{
            return null;
        }

        while(char === '\n'){    
            next();
            newline();
        }

        return true;
    }

    function eof(){
        char = str[cursor];
        if (char===undefined){
            return {
                type: 'EndOfFileToken'
            };
        }
        
        return null
    }

    for(;;){ //works like a while loop
        whitespace();
        const token = whitespace() || operator()|| number() || eol();

        if (token){
            if(token === true){
                continue;
            }

            yield token;

            continue;
        }

        const maybeEof = eof()
        if (maybeEof){
            break;
        }
        
        throw new SyntaxError(
            `Unexpected Token "${char}" at ${file}:${line}:${column}`
            );
    }
}