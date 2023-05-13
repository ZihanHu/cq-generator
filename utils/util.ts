/** 一定被捕获的错误。 */
export class CaughtError extends Error {
  constructor() {
    super('This error will be caught');
  }
}
