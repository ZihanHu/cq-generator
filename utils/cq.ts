import * as mathjs from 'mathjs';
import shuffle from 'lodash-es/shuffle';

export namespace Cq {

  /** 计算题四则运算符。 */
  export enum Operator {
    '+' = 1,
    '-' = 2,
    '*' = 3,
    '/' = 4,
  }
  /** 计算题节点。 */
  export interface Node {
    operator?: Operator;
    number?: number;
  }
  /** 计算题。 */
  export interface Expression {
    /** 计算题节点。 */
    nodes: Node[];
  }

  /**
   * 计算题转字符串。
   * @param exp 计算题
   * @param katex 是否渲染为公式 @default false
   * @returns 字符串算式
   */
  export function expressionToString(exp: Expression, katex = false): string {
    let res = '';
    for (const node of exp.nodes) {
      if (node.number) {
        res += node.number;
      } else if (node.operator) {
        res += Operator[node.operator];
      }
    }
    if (katex) {
      res = (res
        .replaceAll('*', '×')
        .replaceAll('/', '÷')
      );
    }
    return res;
  }

  /**
   * 生成随机数列。
   * @param max 最大值
   * @param num 生成数量
   * @returns 生成的随机数列
   */
  function generateRandomNumbers(max: number, num: number): number[] {
    const randoms = crypto.getRandomValues(new Uint8Array(num));
    const res: number[] = Array.from(randoms);
    for (let i = 0; i < res.length; ++i) { // 处理值的范围
      res[i] %= max;
      ++res[i];
    }
    return res;
  }
  class GenerateFailedSinceOverUplimit extends CaughtError {}
  interface RandomExpressionsOptions {
    /** 生成数量。 */
    num: number;
    /** 数值最大值。 */
    max: number;
    /** 支持运算符。 */
    operators: Operator[];
    /** 数值个数 */
    numbers: number;
  }
  /**
   * 生成随机计算题。
   * @param options 配置
   * @returns 随机生成的计算题
   */
  export function generateRandomExpressions(options: RandomExpressionsOptions): Expression[] {
    const RANDOM_GENERATE_STEP = 10;
    if (options.num < 1) throw new Error('Wrong number of expressions');
    if (options.numbers < 2) throw new Error('Too few numbers');
    const res: Expression[] = [];
    let randoms: number[] = [];
    let ans: number;
    let num: number, op: Operator = Operator['+'];
    /**
     * 获取随机值。
     * @returns 随机值
     */
    function getRandom(): number {
      if (!randoms.length) {
        randoms = generateRandomNumbers(options.max, RANDOM_GENERATE_STEP);
      }
      return randoms.pop()!;
    }
    /**
     * 为当前一步生成答案。
     * @returns 当前答案
     */
    function calc(): number {
      switch (op) {
        case Operator['+']:
          if (ans + num > options.max) { // 超过最大值
            if (options.operators.length === 1 && ans === options.max) { // 只能加法，且无法再加了
              throw new GenerateFailedSinceOverUplimit();
            }
            if (num !== 1) return NaN;
          }
          return mathjs.add(ans, num);
        case Operator['-']:
          if (num > ans) return NaN; // 不够减
          return mathjs.subtract(ans, num);
        case Operator['*']:
          if (ans * num > options.max) return NaN;
          return mathjs.multiply(ans, num);
        case Operator['/']:
          if (ans % num) return NaN; // 得小数
          return mathjs.divide(ans, num);
      }
    }
    /** 执行一步生成。 */
    function generate() {
      let ans2: number;
      do {
        ans2 = ans; // 如果是第二次执行，需要重新设置 ans2
        op = getRandom() % options.operators.length + 1;
        num = getRandom();
        ans2 = calc();
      } while (Number.isNaN(ans2)); // 不合法就重新来
      ans = ans2;
    }
    let current: Expression;
    for (let i = 1; i <= options.num; ++i) {
      try {
        // 生成第一个数据，推入队列
        ans = num = getRandom();
        current = { nodes: [{ number: num }] };
        // 生成剩下的数据
        for (let j = 1; j < options.numbers; ++j) {
          generate(); // 执行一步
          current.nodes.push({ // 推入队列
            operator: op,
          }, {
            number: num,
          });
        }
        res.push(current);
      } catch (e) {
        if (!(e instanceof CaughtError)) throw e; // 异常
        --i; // 本次无效，重新来
      }
    }
    return shuffle(res);
  }
}
