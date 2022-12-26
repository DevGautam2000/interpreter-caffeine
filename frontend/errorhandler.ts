export default class ErrorHandler {
  // deno-lint-ignore no-explicit-any
  static show(...msg: any) {
    console.error(...msg);
  }

  static exit(code = 1) {
    Deno.exit(code);
  }
}
