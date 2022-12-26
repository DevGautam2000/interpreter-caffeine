import Parser from "./frontend/parser.ts";

class Repl {

    static run() { 

        const parser = new Parser()

        while(true){
        
            const input = prompt("> ")

            if(!input || input.trim().includes("exit")){
                console.log("Exited repl.");
                Deno.exit(1)
            } //base case 


            const ast  = parser.generateAST(input)
            console.log(JSON.stringify(ast,null,4));
            
        }

    }
}

Repl.run()