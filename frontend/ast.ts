export enum Node {
  Program = "Program",
  BinaryExpression = "BinaryExpression",
  NumericLiteral = "NumericLiteral",
  Identifier = "Identifier",
}

export interface Statement {
  kind: Node;
}

export interface Program extends Statement {
  kind: Node.Program;
  body: Statement[];
}

/* 
this interface is used to vary expression with statements
like 
let x = 10 // is a statement
but 
    x = 10 //  is an expression as its as assignment expression

this interface gives us more flexibility to differentiate 
expressions
as expression are statements but not all statements are expressions

*/

// deno-lint-ignore no-empty-interface
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  kind: Node.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  kind: Node.Identifier;
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: Node.NumericLiteral;
  value: number;
}
