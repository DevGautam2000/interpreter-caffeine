import {
  Statement,
  Program,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  Expression,
  Node,
} from "./ast.ts";
import ErrorHandler from "./errorhandler.ts";

import { TokenType, Token, tokenize } from "./lexer.ts";

// Orders Of Prescidence
// AssignmentExpression
// MemberExpression
// FunctionCaLL
// LogicalExpression
// ComparisonExpression
// AdditiveExpression
// MultiplicitaveExpression
// UnaryExpression
// PrimaryExpression

export default class Parser {
  private tokens: Token[] = [];

  private eof(): boolean {
    return this.tokens[0].type === TokenType[TokenType.EOF];
  }

  public generateAST(code: string): Program {
    this.tokens = tokenize(code);

    const program: Program = {
      kind: Node.Program,
      body: [],
    };

    while (!this.eof()) {
      program.body.push(this.Parse.statement());
    }

    return program;
  }

  private Consumer = {
    first: () => {
      return this.tokens[0] as Token;
    },
    consume: () => {
      const prevToken = this.tokens.shift() as Token;
      return prevToken;
    },
    expect: (type:TokenType, err: string) => {

      const prev = this.tokens.shift() as Token
      
      if(!prev || prev.type !== TokenType[type]){
        ErrorHandler.show("Parse Error.\n",err,prev,"Expected: ",TokenType[type])
        ErrorHandler.exit() 
      }

      return prev;
    }
  };

  private Parse = {
    statement(): Statement {
      return this.expression();
    },
    expression(): Expression  {
      return this.additiveExpression();
    },

    additiveExpression: () => {
      let left : Expression = this.Parse.multiplicativeExpression()

      while(this.Consumer.first().value == "+" 
      || this.Consumer.first().value == "-" ){
        
        const operator = this.Consumer.consume().value
        const right = this.Parse.multiplicativeExpression()

         left = {
          kind: Node.BinaryExpression,
          left,
          right,
          operator
        } as BinaryExpression

      }
 
      return left
    },

    multiplicativeExpression: () => {
      let left : Expression = this.Parse.primaryExpression()

      while(this.Consumer.first().value == "/" 
      || this.Consumer.first().value == "*" 
      || this.Consumer.first().value == "%" 
      ){
        
        const operator = this.Consumer.consume().value
        const right = this.Parse.primaryExpression()

         left = {
          kind: Node.BinaryExpression,
          left,
          right,
          operator
        } as BinaryExpression

      }
 
      return left
    },

    primaryExpression: () => {
      const tk = this.Consumer.first().type;

      switch (tk) {
        case TokenType[TokenType.Identifier]:
          return {
            kind: Node.Identifier,
            symbol: this.Consumer.consume().value,
          } as Identifier;

        case TokenType[TokenType.Num]:
          return {
            kind: Node.NumericLiteral,
            value: parseFloat(this.Consumer.consume().value),
          } as NumericLiteral;

        case TokenType[TokenType.OpenParen]: {
          this.Consumer.consume() //consume the open paren
          const value = this.Parse.expression()
          this.Consumer.expect(
            TokenType.CLoseParen,
            "Unexpected token found. Expected closing parenthesis."
          ) //consume the closing paren
          return value
        }
        default:
          ErrorHandler.show("Unexpected token found: ", this.Consumer.first())
          ErrorHandler.exit()
          
          //unreachable statement
          return {} as Expression
      }
    },
  };

  
}

//todo : check precedence for closing and opening parenthesis