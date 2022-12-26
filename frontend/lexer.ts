export enum TokenType {
  Num,
  Identifier,
  Equal,
  OpenParen,
  CLoseParen,
  BinaryOperator,
  Let,
  Comment,
  EOF,
}

let lineNum = 0;

export interface Token {
  value: string;
  type: string;
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

function token(value = "", type: TokenType): Token {
  return { value, type: TokenType[type] };
}

function isAlpha(str: string): boolean {
  return str.toLowerCase() != str.toUpperCase();
}

function isNum(str: string): boolean {
  const unicode = str.charAt(0);
  const bounds = ["0".charAt(0), "9".charAt(0)];

  return bounds[0] <= unicode && unicode <= bounds[1];
}

function isSkipable(str: string): boolean {
  return [" ", "\n", "\t"].includes(str);
}
export function tokenize(code: string): Token[] {
  const tokens: Token[] = new Array<Token>();

  //split the code
  const src = code.split("");
  let charAt = 1;

  while (src.length > 0) {
    //handle comments
    if (src[0] == "/" && src[1] == "/") {
      src.shift();
      break;
    }

    switch (src[0]) {
      case "(":
        tokens.push(token(src.shift(), TokenType.OpenParen));
        break;

      case ")":
        tokens.push(token(src.shift(), TokenType.CLoseParen));
        break;

      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
        tokens.push(token(src.shift(), TokenType.BinaryOperator));
        break;

      case "=":
        tokens.push(token(src.shift(), TokenType.Equal));
        break;

      default:
        // check for multicharacter values

        if (isNum(src[0])) {
          let num = "";

          while (src.length > 0 && isNum(src[0])) {
            num += src.shift();
          }

          tokens.push(token(num, TokenType.Num));
        } else if (isAlpha(src[0])) {
          let identifier = "";

          while (src.length > 0 && isAlpha(src[0])) {
            identifier += src.shift();
          }

          // check for reserved keywords
          const reservedType: TokenType = KEYWORDS[identifier];

          if (reservedType == undefined)
            tokens.push(token(identifier, TokenType.Identifier));
          else tokens.push(token(identifier, reservedType));
        } else if (isSkipable(src[0])) {
          src.shift();
        } else {
          console.log(
            `Token [ ${src[0]} ] not recognized at ${lineNum}:${charAt} `
          );
          Deno.exit(1);
        }

        break;
    }

    charAt++;
  }

  //signifies end of file
  tokens.push({
    value: "EndOfFile",
    type: TokenType[TokenType.EOF],
  });

  return tokens;
}

// const file = "./test.txt"

// const data = await Deno.readTextFile(file)
// const source = data.split('\n');

// lineNum=1
// for(const line of source){
//     for (const token of tokenize(line))
//         console.log(token);
//     lineNum++
// }
