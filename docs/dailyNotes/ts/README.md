# 什么是TS

是一种静态类型语言，是动态类型语言js的超集。js虽然也有类型，但它是随时可变的。所以添加了ts这种静态类型语言来约束。

TypeScript 使用结构化类型，这个系统并不同于你可能使用过的一些其他流行语言（如：Java、C# 等）的类型系统。

结构化类型系统背后的思想是如果他们的成员类型是兼容的，则他们是兼容的。

它有优点如下：

1. 有利于代码的静态分析，在写的阶段就能发现问题
2. 有利于发现问题，由于每个值、每个变量、每个运算符都有严格的类型约束，TypeScript 就能轻松发现拼写错误、语义错误和方法调用错误，节省程序员的时间。
3. 更好的IDE支持。
4. 提供了代码文档，类型信息可以部分替代代码文档，解释应该如何使用这些代码。
5. 有助于代码重构。修改他人的 JavaScript 代码，往往非常痛苦，项目越大越痛苦，因为不确定修改后是否会影响到其他部分的代码。

当然也有缺点，如下：

1. 丧失了动态类型的代码灵活性。
2. 增加了编程工作量。
3. 更高的学习成本。
4. 引入了独立的编译步骤，需要专门的ts编译器转化。
5. 兼容性问题。TypeScript 依赖 JavaScript 生态，需要用到很多外部模块。但是，过去大部分 JavaScript 项目都没有做 TypeScript 适配，虽然可以自己动手做适配，不过使用时难免还是会有一些兼容性问题。

学习 ts 需要分清楚“值”（value）和“类型”（type）,ts“类型”是针对“值”的，ts代码只涉及类型，不涉及值。所有跟“值”相关的处理，都由 JavaScript 完成。
需要时刻注意 ts只是一种类型约束，并不代表代码逻辑。

[ts官方提供的在线演练](https://www.typescriptlang.org/play?#code/C4TwDgpgBAGlC8UDOwBOBLAdgcwFABsJgoAPALhlygGMB7TJWwgOn1uwApRJaAzUgJS4gA)

## 类型

先看一下ts专门提供的3种特殊类型 “顶层类型”any、unknown，和“底层类型”never。

“顶层类型”any、unknown可以被赋值任意其他类型。
“底层类型”never类型可以赋值给任意其他类型。

```typescript
let v:any = 123;
v = '1'

// 表示永远没有返回值
function f():never {
  throw new Error('Error');
}
let v1:number = f(); // 不报错
let v2:string = f(); // 不报错
let v3:boolean = f(); // 不报错
```

1. any类型表示没有任何限制，该类型的变量可以赋予任意类型的值。
2. unknown 与any含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像any那样自由，可以视为严格版的any。
   1. unknown类型的变量，不能直接赋值给其他类型的变量（除了any类型和unknown类型）。

        ```typescript
        // let v:any = 123;
        // let v1:boolean = v; // 正确
        // let v2:number = v; // 正确
      // 上述v为any类型，可以赋值给任意类型，但会对v1和v2造成类型污染。

      // 变量v是unknown类型，赋值给any和unknown以外类型的变量都会报错，
      // 这就避免了any类型的污染问题
        let v:unknown = 123;
        let v1:boolean = v; // 报错
        let v2:number = v; // 报错
        ```

   2. 不能直接调用unknown类型变量的方法和属性。

      ```typescript
        let v1:unknown = { foo: 123 };
        v1.foo  // 报错

        let v2:unknown = 'hello';
        v2.trim() // 报错

        let v3:unknown = (n = 0) => n + 1;
        v3() // 报错
      ```

   3. unknown类型变量能够进行的运算是有限的。只能进行比较运算（运算符==、===、!=、!==、||、&&、?）、取反运算（运算符!）、typeof运算符instanceof运算符这几种，其他运算都会报错。

   ```typescript
   let a:unknown = 1;

    a + 1 // 报错
    a === 1 // 正确
   // 那么，怎么才能使用unknown类型变量呢？也就是可以让 a + 1输出正确结果
   // 答案是只有经过“类型缩小”，就是缩小unknown变量的类型范围，确保不会出错。
    let b:unknown = 1;
    // unknown类型的变量a经过typeof运算以后，能够确定实际类型是number，就能用于加法运算了
    if (typeof b === 'number') {
      let r = b + 10; // 正确
    }
    // 这就是“类型缩小”，即将一个不确定的类型缩小为更明确的类型。
   // unknown可以看作是更安全的any。一般来说，凡是需要设为any类型的地方，通常都应该优先考虑设为unknown类型
   ```

3. never“空类型”的概念，即该类型为空，不包含任何值。
   1. ```let x:never;```变量x的类型是never，就不可能赋给它任何值，否则都会报错。

5种基本类型boolean,string,number,bigint,symbol， 3种特殊类型object,undefined,null。

1. bigint用于表示超出标准整数范围的整数。eg：```const x: bigint = 123n```，123n 表示一个 BigInt 值，它的值就是整数 123。
2. symbol用于创建唯一且不可变的标识符，eg: ```const x:symbol = Symbol()```，这样，变量 x 就被赋值为一个全局唯一的 Symbol。每个
   Symbol 都是独一无二的。可以用来做provide的key。
3. object 类型包含了所有对象、数组和函数。eg：

    ```typescript
   const x:object = { foo: 123 }; // 对象
   const y:object = [1, 2, 3]; // 数组
   const z:object = (n:number) => n + 1; // 函数
   ```

4. TypeScript 规定，单个值也是一种类型，称为“值类型”。

   ```typescript
   let x:'hello';
   x = 'hello'; // 正确
   // 变量x的类型是字符串hello，导致它只能赋值为这个字符串，赋值为其他字符串就会报错
   x = 'world'; // 报错

   // const命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型
   // z 的类型是 "https"
    const z = 'https';
    // y 的类型是 string
    const y:string = 'https';
   ```

5. TypeScript 支持块级类型声明，也就是说在大括号里面的类型只会在当前作用域生效。

### 联合类型和交叉类型

1. 联合类型A|B表示，任何一个类型只要属于A或B，就属于联合类型A|B，eg：```const a = string|number```。
   1. 联合类型一般会需要进行“类型缩小”操作，eg：

       ```typescript
       function getPort(
         scheme: 'http'|'https'
         ) {
       // scheme 可能是两种情况，函数体内部就需要区分不同情况走不同逻辑，这就是圈定类型走对应逻辑
         switch (scheme) {
           case 'http':
            return 80;
           case 'https':
            return 443;
         }
       }
       ```

2. 交叉类型A&B表示，任何一个类型必须同时属于A和B，交叉类型常常用来为对象类型添加新属性，eg：```const a = {a: 1}&{b: 2}```。
    1. 所以交叉类型的主要用途是表示对象的合成。eg：

        ```typescript
        // 定义obj类型，要求必须同时有foo和bar属性
        let obj: { foo: string } & { bar: string };
        // 具体值实现
        obj = {
        foo: 'hello',
        bar: 'world'
        };
        ```

    2. 如果两个类型中 有相同key但是类型不同，则该key为never类型。eg：

    ```typescript
      interface Eg1 {
        name: string,
        age: number,
      }

      interface Eg2 {
        color: string,
        age: string,
      }

      // T的类型为 {name: string; age: never; color: string}
      // 注意，age因为Eg1和Eg2中的类型不一致，所以交叉后age的类型是never
      type T = Eg1 & Eg2
      // 可通过如下示例验证
      const val: T = {
        name: '',
        color: '',
        age: (function a() { // 不会抱错
          throw Error()
        })(),
      }
    ```

### type

type命令用来定义一个类型的别名。eg：

```typescript
// type命令为number类型定义了一个别名Age。这样就能像使用number一样，使用Age作为类型。
type Age = number;
let age:Age = 55; // 相当于age:number = 55
```

1. 不允许重复
2. 别名的作用域是块级作用域。这意味着，代码块内部定义的别名，影响不到外部

   ```typescript
   type Color = 'red';
   if (Math.random() < 0.5) {
    type Color = 'blue';
   }
   ```

3. 别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套

   ```typescript
   type World = "world";
   type Greeting = `hello ${World}`;
   ```

### typeof运算符

ts 将js的typeof 运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 ts 类型。 eg：

```typescript
// JavaScript 里面，typeof运算符只可能返回八种结果，而且都是字符串。
typeof undefined; // "undefined"
typeof true; // "boolean"
typeof 1337; // "number"
typeof "foo"; // "string"
typeof {}; // "object"
typeof parseInt; // "function"
typeof Symbol(); // "symbol"
typeof 127n // "bigint"

// 举例
const a = { x: 0 };
type T0 = typeof a;   // { x: number }，如果是js中的 type a 返回的会是"object"
type T1 = typeof a.x; // number

// 所以在使用时需要注意ts的和js的typeof 搞混了
// ts的typeof 只能用在类型运算之中（即跟类型相关的代码之中），不能用在值运算
let c = 1;
let b:typeof c; // ts的typeof返回number类型，最终编译结果这个typeof会被删掉
console.log(typeof c === 'number') // js的typeof返回字符串'number'类型，最终编译结果这个typeof会保留
// 编译结果
// let c = 1;
// let b;
// console.log(typeof c === 'number')
```

1. 由于编译时不会进行 JavaScript 的值运算，所以TypeScript 规定，typeof 的参数只能是标识符，不能是需要运算的表达式。

   ```typescript
   type T = typeof Date(); // 报错 Date()需要运算才知道结果。
   ```

2. typeof命令的参数不能是类型

   ```typescript
   type Age = number;
   type MyAge = typeof Age; // 报错 Age是一个类型别名，用作typeof命令的参数就会报错。
   ```

## 类型兼容

TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型。eg：

  ```typescript
    // 如果类型A的值可以赋值给类型B，那么类型A就称为类型B的子类型（subtype）
    type T = number|string;
    let a:number = 1;
    // 类型number就是类型number|string的子类型。b的类型兼容a的类型
    let b:T = a;

    // 但是凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行。
    // hi是string的子类型，string是hi的父类型。
    // 所以，变量c可以赋值给变量d，但是反过来就会报错
    let c:'hi' = 'hi';
    let d:string = 'hello';
    d = c; // 正确
    c = d; // 报错，此时c的类型是值类型“hi”，而d的类型是string 可以是任意字符串，所以不能赋值给c

    //子类型继承了父类型的所有特征，所以可以用在父类型的场合。但是，子类型还可能有一些父类型没有的特征，所以父类型不能用在子类型的场合。
  ```

因此，我们可以得出基本的结论：子类型比父类型更加具体,父类型比子类型更宽泛。

## 数组和元组

### 数组

JavaScript 数组在 TypeScript 里面分成两种类型，分别是数组（array）和元组（tuple）。

1. TypeScript 数组有一个根本特征：所有成员的类型必须相同，但是成员数量是不确定的，可以是无限数量的成员，也可以是零成员。eg：

   ```typescript
   let arr:number[] = [1, 2, 3]
   arr.push(4) // 数组增加成员或减少成员，都是可以的

   // 定义数组成员可以有不同类型
   // 这里注意区分括号是必须的，因为竖杠（|）的优先级低于[]，如果不带括号ts会理解成number和string[]的联合类型
   let arr1:(number|string)[] = [1, 2, '3']
   // 范型写法
   let arr2:Array<number> = [1, 2, 3]
   let arr3:Array<number|string> = [1, 2, '3']
   ```

2. 在js种，通过const定义的数组允许修改，在ts种也是，那如何定义只读的数组呢？

    ```typescript
   // 在ts中可以声明只读类型的数组
    const arr:readonly number[] = [0, 1];
    arr[1] = 2; // 报错
    arr.push(3); // 报错
    delete arr[0]; // 报错
    // 只读数组的另外一种写法，断言为const不可变
   // as const告诉 TypeScript，推断类型时要把变量arr推断为只读数组，从而使得数组成员无法改变。
    const arr1 = [0, 1] as const;
    arr1[0] = [2]; // 报错
   // TypeScript 将readonly number[]与number[]视为两种不一样的类型，后者是前者的子类型。
   // 这是因为只读数组没有pop()、push()之类会改变原数组的方法，
   // 所以number[]的方法数量要多于readonly number[]，
   // 这意味着number[]其实是readonly number[]的子类型。

   // 所以子类型number[]可以用于所有使用父类型的场合，反过来就不行。
    let a1:number[] = [0, 1];
    let a2:readonly number[] = a1; // 正确
    a1 = a2; // 报错

   // 注意：readonly关键字不能与数组的泛型写法一起使用。
   //  const arr2:readonly Array<number> = [0, 1]; // 报错 'readonly' type modifier is only permitted on array and tuple literal types.
   // 所以ts专门提供了两个范型，用来生成只读数组
   const a4:ReadonlyArray<number> = [0, 1]; // 尖括号里面是数组成员
    const a5:Readonly<number[]> = [0, 1]; // 尖括号里面是整个数组
    ```

3. TypeScript 使用T[][]的形式，表示二维数组，T是最底层数组成员的类型。eg：

   ```typescript
    let arr:number[][] = [[1,2,3], [23,24,25]]
   ```

### 元组

元组（tuple）是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。
它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同，但必须明确声明每个成员的类型。
一般使用场景：

```typescript
// 数组的成员类型写在方括号外面（number[]），元组的成员类型是写在方括号里面（[number]）。
let a:[number] = [1]; // 元组
// 元组的只读属性，属性加问号
let a2:[number, number?] = [1];
// 但是问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后。
type myTuple = [
  number,
  number?,
  string?
];
// 接收x和y两个参数，并且都是number类型
function distanceFromOrigin([x, y]:[number, number]) {
  return Math.sqrt(x**2 + y**2);
}
```

1. 数组的成员类型写在方括号外面（number[]），元组的成员类型是写在方括号里面（[number]）。
2. 元组成员的类型可以添加问号后缀（?），表示该成员是可选的。
   1. 注意：问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后。
3. 由于需要声明每个成员的类型，所以大多数情况下，元组的成员数量是有限的，从类型声明就可以明确知道，元组包含多少个成员，越界的成员会报错。eg：

   ```typescript
   let x:[string, string] = ['a', 'b'];
   x[2] = 'c'; // 报错

   // 但是使用扩展运算符（...），可以表示不限成员数量的元组。
   type NamedNums = [
     string,
     ...number[]
   ];
   const a:NamedNums = ['A', 1, 2];
   const b:NamedNums = ['B', 1, 2, 3];
   // 扩展运算符用在元组的任意位置都可以，但是它后面只能是数组或元组
   type t1 = [string, number, ...boolean[]];
   type t2 = [string, ...boolean[], number];
   type t3 = [...boolean[], string, number];
   // 如果不确定元组成员的类型和数量，可以写成下面这样
   type Tuple = [...any[]]

   // 只读元组
   type t = readonly [number, string];
   type t = Readonly<[number, string]> // 范型写法
   // 跟数组一样，只读元组是元组的父类型。所以，元组可以替代只读元组，而只读元组不能替代元组。
   type t4 = readonly [number, number];
    type t5 = [number, number];

    let x1:t5 = [1, 2];
    let y:t4 = x1; // 正确
    x1 = y; // 报错
   ```

## symbol类型

每一个symbol都是独一无二的，类型是symbol，

```typescript
let x:symbol = Symbol();
let y:symbol = Symbol();
x === y // false
// 上面 symbol类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。
// 如果想表达具体的值，需要用unique symbol，必须用const声明，用let会抱错
const z:unique symbol = Symbol(); // 相当于 z:'z' = 'z'
const a:unique symbol = Symbol();
const b:typeof a = a; // 正确

//unique symbol 类型的一个作用，就是用作属性名，
// 这可以保证不会跟其他属性名冲突。
// 如果要把某一个特定的 Symbol 值当作属性名，那么它的类型只能是 unique symbol，
// 不能是 symbol。
const x1:unique symbol = Symbol();
const y1:symbol = Symbol();
interface Foo {
  [x1]: string; // 正确
  [y1]: string; // 报错
}
```

## 函数

函数的类型声明，需要在声明函数时，给出参数的类型和返回值的类型。eg：

```typescript
// 写法一
const hello = function (txt:string):void {
  console.log('hello ' + txt);
}
// 写法二
// 函数的参数要放在圆括号里面，不放会报错
const hello2: (txt:string) => void = function (txt) {
  console.log('hello ' + txt);
};
```

1. 函数类型还可以采用对象的写法。写法如下：

   ```typescript
    add = function (x, y) {
      return x + y;
    };
    add.version = 1
    // {
    //   (参数列表): 返回值
    // }
    let Add:{
      (x:number, y:number):number;
      version: number
    } = add

    // 也可以使用interface描述类型
    interface myfn {
      (a:number, b:number): number;
    }
    var add:myfn = (a, b) => a + b;
    ```

2. 问题

   ```typescript
    type Person = { name: string };
    const people = ['alice', 'bob', 'jan'].map(
      (name):Person => ({name})
    );
    console.log(people, typeof people)
   ```

3. 函数可以设置可选参数，只需在参数名称后面加问号既可以，eg：

   ```typescript
   function f(x?:number) { return x }
   f(undefined) // 会抱错吗？
   // 函数的可选参数只能在参数列表的尾部，跟在必选参数的后面。
   // let myFunc: (a?:number, b:number) => number; // 报错

   // 如果前面的参数有可能为空，这时只能显式注明该参数类型可能为undefined。
   let myFunc: (a:number|undefined, b:number) => number;
   ```

4. 函数可以设置默认值，写法跟js一样，设置了默认值的参数，就是可选的。如果不传入该参数，它就会等于默认值。eg：

   ```typescript
   function createPoint(
   x:number = 0,
   y:number = 0
   ):[number, number] {
   return [x, y];
   }
   createPoint() // [0, 0]

   // 但是可选参数与默认值不能同时使用
   //  function f(x?: number = 0) { // 报错}
   ```

5. 设有默认值的参数，如果传入undefined，也会触发默认值。

     ```typescript
    function f(x = 456) {
       return x;
    }
    f2(undefined) // 456
    // 问题：怎么让函数调用结果等于1
   function add (
    x:number = 0,
    y:number
    ) {
      return x + y;
    }
   ```

6. 函数参数解构和rest
   1. 函数参数解构可以和type别名一起用，eg：

      ```typescript
      type ABC = { a:number; b:number; c:number };
      function sum({ a, b, c }:ABC) {
        console.log(a + b + c);
      }
      ```

   2. rest参数表示函数剩余的所有参数，它可以是数组（剩余参数类型相同），也可能是元组（剩余参数类型不同）,eg：

      ```typescript
      // rest 参数为数组
      function joinNumbers(...nums:number[]) {}
      // rest 参数为元组
      function f(...args:[boolean, number]) {}

      // 注意，元组需要声明每一个剩余参数的类型。如果元组里面的参数是可选的，则要使用可选参数
      function f(
       ...args: [boolean, string?]
      ) {}
      ```

7. 返回值：void定义、never定义和readonly参数
   1. 如果变量、对象方法、函数参数的类型是 void 类型的函数，那么并不代表不能赋值为有返回值的函数。恰恰相反，该变量、对象方法和函数参数可以接受返回任意值的函数，这时并不会报错。

      ```typescript
      type voidFunc = () => void;
      const f:voidFunc = () => {
       return 123;
      };
      // 这是因为，这时 TypeScript 认为，这里的 void 类型只是表示该函数的返回值没有利用价值，
      // 或者说不应该使用该函数的返回值。只要不用到这里的返回值，就不会报错。
      const a = f() + 1 // 这儿就会抱错
      ```

   2. never类型表示肯定不会出现的值。它用在函数的返回值，就表示某个函数肯定不会返回值，即函数不会正常执行结束。

      ```typescript
      // 注意，never类型不同于void类型。前者表示函数没有执行结束，不可能有返回值；
      // 后者表示函数正常执行结束，但是不返回值，或者说返回undefined。

      // 注意，只有抛出错误，才是 never 类型。如果显式用return语句返回一个 Error 对象，返回值就不是 never 类型
      function fail(msg:string):never {
        throw new Error(msg);
      }
      ```

   3. readonly eg：

     ```typescript
     function arraySum(
       arr:readonly number[]
     ) {
      arr[0] = 0; // 报错
     }
     ```

8. 高阶函数：一个函数的返回值还是一个函数，那么前一个函数就称为高阶函数。eg：

   ```typescript
   (someValue: number) => {
    return (multiplier: number) => someValue * multiplier
   };
   ```

9. 函数重载：有些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载。eg：

    ```typescript
    // 前两行类型声明列举了重载的各种情况。第三行是函数本身的类型声明，它必须与前面已有的重载声明兼容
    function reverse(str:string):string;
    function reverse(arr:any[]):any[];
    function reverse(
      stringOrArray:string|any[]
    ):string|any[] {
      if (typeof stringOrArray === 'string')
        return stringOrArray.split('').reverse().join('');
      else
        return stringOrArray.slice().reverse();
    }
    ```

10. 构造函数：JavaScript 语言使用构造函数，生成对象的实例。构造函数的最大特点，就是必须使用new命令调用。eg：

     ```typescript
    // js构造函数
    const d = new Date(); // 使用new命令调用，返回 Date 对象的实例
    // 构造函数的类型写法，就是在参数列表前面加上new命令。
    class Animal {
      numLegs:number = 4;
    }
    // 用new关键字来声明传入的c是一个构造函数而不是普通函数
    function create(c:new () => Animal):Animal {
      return new c();
    }
    const a = create(Animal);

    // 构造函数另一种写法 就是用对象形式
    type F = {
       new (s:string): object;
    };
    // 某些函数既是构造函数，又可以当作普通函数使用，比如Date()。这时，类型声明可以写成下面这样
    type F = {
       new (s:string): object;
       (n?:number): number;
    }
    ```

## 对象

除了原始类型，对象是 JavaScript 最基本的数据结构。TypeScript 对于对象类型有很多规则。

对象类型的最简单声明方法，就是使用大括号表示对象，在大括号内部声明每个属性和方法的类型。
eg：

```typescript
 // 最简单的声明，其中属性的类型可以用分号结尾，也可以用逗号结尾，最后一个属性后面，可以写分号或逗号，也可以不写
  const obj:{
    x:number;
    y:number
  } = { x: 1, y: 1 };
  // 属性类型以逗号结尾
  type MyObj = {
    x:number,
    y:number,
  };
  // 一旦声明了类型，对象赋值时，就不能缺少指定的属性，也不能有多余的属性，读写不存在的属性也会报错，也不能删除类型声明中存在的属性
  // 对象的方法使用函数类型描述
  const obj2: {
    x: number;
    y: number;
    add(x:number, y:number): number;
    // 或者写成
    // add: (x:number, y:number) => number;
  } = {
    x: 1,
    y: 1,
    add(x, y) {
      return x + y;
    }
  };
  // 可以读取对象的属性类型
  type X1 = MyObj['x']

  // 可以发现，上述都是用type声明对象的类型，除了type命令可以为对象类型声明一个别名，
// ts 还提供了interface命令，可以把对象类型提炼为一个接口
  interface MyObj {
    x: number;
    y: number;
  }
  // 可选属性，只读属性
  type User = {
    firstName: string;
    lastName?: string;
    lastName2: string|undefined; // 可选属性等同于lastName的值可以为undefined
    readonly prop: number; // 只读属性只能在对象初始化期间赋值，此后就不能修改该属性
  }
  const user:User = {firstName: '1', lastName2: undefined, prop: 1}
  // user.prop = 2 会抱错 Cannot assign to 'prop' because it is a read-only property.

  // 但是 如果属性值是一个对象，readonly修饰符并不禁止修改该对象的属性，只是禁止完全替换掉该对象
  // 如果两个变量对应同一个对象，其中一个变量是可写的，另一个变量是只读的，那么从可写变量修改属性，会影响到只读变量
  interface Person {
    name: string;
    age: number;
  }
  interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
  }
  let w:Person = {
    name: 'Vicky',
    age: 42,
  };
  let r:ReadonlyPerson = w;
  w.age += 1;
  r.age // 43
```

  1. 属性名称的索引类型：如果对象有很多个暂时无法确定的属性，可以使用索引，eg：

     ```typescript
     type MyObj = {
      [property: string]: string // 这儿property表示属性名称，这个可以随便起，后面的string标识属性名称的类型是字符串，值也是字符串
     };
     // 需要注意的是 属性名称的类型 只有 string，number，symbol三种
     ```

  2. 解构赋值

     ```typescript
     const {id, name, price}:{
     id: string;
     name: string;
     price: number
     } = product;
     ```

  3. 结构类型原则：只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则。

     ```typescript
     // 对象A只有一个属性x，类型为number。对象B满足这个特征，因此兼容对象A，只要可以使用A的地方，就可以使用B
      type A = {
        x: number;
      };

      type B = {
         x: number;
        y: number;
     };
     const b = {
        x: 1,
        y: 1
      };
     // A和B并不是同一个类型，但是B可以赋值给A，因为B满足A的结构特征
      const a:{ x: number } = b; // 正确

     // 问题：
     type myObj = {
        x: number,
        y: number,
      };
     function getSum(obj:myObj) {
       let sum = 0;

       for (const n of Object.keys(obj)) {
     // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'myObj'.
     // No index signature with a parameter of type 'string' was found on type 'myObj'.
         const v = obj[n]; // 报错 为什么
         sum += Math.abs(v);
       }
       return sum;
     }
     // 函数getSum()要求传入参数的类型是myObj，但是实际上所有与myObj兼容的对象都可以传入。
     // 这会导致const v = obj[n]这一行报错，原因是obj[n]取出的属性值不一定是数值（number），使得变量v的类型被推断为any。
     // 如果项目设置为不允许变量类型推断为any，代码就会报错
     ```

  4. 最小可选属性规则，eg：

      ```typescript
      type Options = {
        a?:number;
        b?:number;
        c?:number;
      };
      // 类型Options是一个对象，它的所有属性都是可选的，这导致任何对象实际都符合Options类型
        const obj:Options = {
          d: 123 // 报错
        };
      // 为了避免这种情况，ts 添加了最小可选属性规则，规定这时属于Options类型的对象，必须至少存在一个可选属性，不能所有可选属性都不存在
      ```

  5. 空对象，eg：

      ```typescript
      // 在js种，我们一般会先定义空对象，然后在填充属性，
      // 但是在ts中，如果定义了空对象，就会被解析为特殊类型：空对象，不允许再填充属性了。
      let pt = {}; // 等同于const pt:Object
      pt.x = 3; // 错误，空对象不能填充属性
      pt = 2 // 都是合法的，因为这些都是object类型，除了null和undefined
      pt = '2'
      pt = {}

      // 如果确实需要分步声明，一个比较好的方法是，使用扩展运算符（...）合成一个新对象。
      const pt0 = {};
      const pt1 = { x: 3 };
      const pt2 = { y: 4 };
      const pt3 = {
        ...pt0, ...pt1, ...pt2
      };
      ```

## interface 接口

interface 可以表示对象的各种语法，它的成员有5种形式。

1. 定义
   * 对象属性
     * interface Point {
       x: number;
       y: number;
       }
   * 对象的属性索引，属性索引共有string、number和symbol三种类型。
     * interface A {
       [prop: string]: number;
       }
   * 对象方法
     * // 写法一
       interface A {
        f(x: boolean): string;
       }
     * // 写法二
     interface B {
      f: (x: boolean) => string;
     }
     * // 写法三
       interface C {
        f: { (x: boolean): string };
       }
     * 属性名称可以用表达式，所以可以有如下写法：
       const f = 'f'
       interface A {
        [f](x: boolean): string;
       }
     * 类型方法可以使用重载

       ```typescript
       interface A {
         f(): number;
         f(x: boolean): boolean;
         f(x: string, y: string): string;
       }
       ```

   * 函数，interface 也可以用来声明独立的函数。

     ```typescript
     interface Add {
       (x:number, y:number): number;
     }
     const myAdd:Add = (x,y) => x + y;
     ```

   * 构造函数
     * interface 内部可以使用new关键字，表示构造函数.

       ```typescript
       // TypeScript 里面，构造函数特指具有constructor属性的类
       interface Greeter {
        greeting(): string;
        }
        class CustomGreeter implements Greeter {
          constructor(private message: string = "Hello") {}
        
          greeting(): string {
            return this.message;
          }
        }
        
        const customErrorConstructor: ErrorConstructor1 = CustomGreeter;
        
        // 使用 customErrorConstructor 创建对象
        const greeterInstance = new customErrorConstructor("Custom Greeting");
        
        console.log(greeterInstance.greeting()); // 输出: "Custom Greeting"
       ```

2. 继承extends
   1. interface之间继承

      ```typescript
      interface Style {
       color: string;
      }
      interface Shape extends Style {
      name: string;
      }
      // 可以逗号分割多重继承
      interface Circle extends Style, Shape {
      radius: number;
      }
      ```

   2. interface继承type

      ```typescript
      type Country = {
            name: string;
            capital: string;
      }
      // 如果type命令定义的类型不是对象，interface 就无法继承
      interface CountryWithPop extends Country {
            population: number;
      }
      ```

   3. interface继承class

      ```typescript
      class A {
        x:string = '';

        y():boolean {
            return true;
        }
      }
      interface B extends A {
        z: number
      }
      ```

   4. 联合类型与继承

    ```typescript
      // type A1 = 1
      type A1 = 'x' extends 'x' ? 1 : 2;

      // type A2 = 2
      type A2 = 'x' | 'y' extends 'x' ? 1 : 2;

      // type A3 = 1 | 2
      type P<T> = T extends 'x' ? 1 : 2;
      type A3 = P<'x' | 'y'>
      // 为什么A2和A3的值不一样？
      // 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型。
      // 若extends前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给extends后面的类型（是一个分发的过程）。
      // 就是extends前面的参数为联合类型时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。
      // 如果不想被分解（分发），做法也很简单，可以通过简单的元组类型包裹以下
      type P<T> = [T] extends ['x'] ? 1 : 2;
      // type A4 = 2;
      type A4 = P<'x' | 'y'>
    ```

3. 接口合并：多个同名接口会合并成一个接口。同名接口合并时，同一个属性如果有多个类型声明，彼此不能有类型冲突。

## class类

eg：

```typescript
class Point {
  // 先声明class的属性和方法的类型和返回值
  x: number; // 公开的属性，public可以省略
  y: number;
  readonly z: string = '1'; // 只读，私有，公开一些功能支持
  public a: number = 1; // 公开
  private b: number = 2; // 私有
  protected c: number = 3; // 保护成员
  static #count = 0; // static定义静态属性，只能通过构造函数访问。Point.count

  // 这儿可以使用重载逻辑
  constructor(x: number, y: string)
  constructor(x: number, y: number | string) {
    this.x = x;
    this.y = y;
  }

  // 定义方法的参数类型和返回值
  add(point: Point) {
    return new Point(
      this.x + point.x,
      this.y + point.y
    );
  }
}

class Point2 extends Point {
  // class里面也可以使用索引签名，使用方式跟对象的一样
  [attrName: string]: any;
  e: any;
  constructor(e) {
    // 继承的子类在使用this之前必须调用super方法
    super();
    this.e = e
  }
  // 可以使用get和set
  get e () {
    return this.e
  }
  set e (newVal: string | number | null | undefined) {
    this.e = newVal
  }
}
```

  1. implements关键字：实现（implements）是面向对象中的一个重要概念。
      一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性。

      ```typescript
        // 假如class1和class2都有相同的ping方法，此时就可以把ping方法提取出来，然后用implements去分别实现
        interface Pingable {
          ping(): void;
        }
          
        class Sonar implements Pingable {
          ping() {
            console.log("ping!");
          }
        }
      ```

  2. abstract抽象类：抽象类的作用是充当实现所有抽象成员的子类的基类。

      ```typescript
        abstract class Base {
          abstract getName(): string;
        
          printName() {
            console.log("Hello, " + this.getName());
          }
        }
        // 抱错 Cannot create an instance of an abstract class.
        // const b = new Base(); // 无法实例化Base因为它是抽象的
        // 我们需要创建一个派生类并实现抽象成员
        class Derived extends Base {
          getName() {
            return "world";
          }
        }
        const d = new Derived();
        d.printName();
        // 如果我们忘记实现基类的抽象成员，我们将收到错误
        class Derived extends Base {
          // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
          // 如果里面没有实现抽象类定义的abstract方法和属性，会抱错
        }
      ```

## 范型

有些时候，我们希望返回的跟传入的类型一致，此时就用到了范型，一般有 函数、接口、类和别名四个使用场景。eg：

```typescript
// 这儿尖括号和里面的T组合就是范型的写法
// T不是固定的，类型参数的名字，可以随便取，但是必须为合法的标识符，一般是T，U，V等，多个参数逗号分割
// 这个方法表示 传入的是T类型的数组，返回的是T类型
function getFirst<T>(arr:T[]):T {
  return arr[0];
}
// 这个方法调用时就必须提供类型参数
getFirst<number>([1, 2, 3])
// 尖括号里面可以是以上介绍的任意类型
function map<T, U>(
  arr:T[],
  f:(arg:T) => U
):U[] {
  return arr.map(f);
}

// 用法实例
map<string, number>(
  ['1', '2', '3'],
  (n) => parseInt(n)
); // 返回 [1, 2, 3]

// interface的范型写法
interface Box<Type> {
  contents: Type;
}
let box:Box<string>;
// interface的范型写法定义函数
interface Fn {
  <Type>(arg:Type): Type;
}
function id<Type>(arg:Type): Type {
  return arg;
}
let myId:Fn = id;

// class类的范型写法
class Pair<K, V> {
  key: K;
  value: V;
}

// type类型别名的范型写法
type Nullable<T> = T | undefined | null; // 只要传入一个类型，就可以得到这个类型与undefined和null的一个联合类型
type Tree<T> = { // 可以内部递归使用Tree自身
  value: T;
  left: Tree<T> | null;
  right: Tree<T> | null;
};

// 类型参数可以有默认值
// 但是一旦类型参数有默认值，就表示它是可选参数。如果有多个类型参数，可选参数必须在必选参数之后
// <T = boolean, U> // 错误
// <T, U = boolean> // 正确

// 数组的范型写法
let arr:Array<number> = [1, 2, 3]; // number[]就是它的简写形式

// 范型的类型参数的约束条件
function comp<Type>(a:Type, b:Type) {
  // 这种情况下，就要求传入的Type范型不许有length属性，但这个要求是隐式的
  if (a.length >= b.length) {
    return a;
  }
}
// 所以ts允许在类型参数上面写明约束条件
function comp<T extends { length: number }>( a: T, b: T ) {
  if (a.length >= b.length) {
    return a;
  }
}
// 类型参数的约束条件通常采用写法：<TypeParameter extends ConstraintType>
// 范型的特点和注意：
/*
* 1. 尽量少用范型，会加大代码的复杂性，使其变得难读难写
* 2. 类型参数越少越好，多一个就会更复杂
* 3. 类型参数需要出现两次，如果类型参数在定义后只出现一次，那么很可能是不必要的
*    function greet<Str extends string>(s:Str) { console.log('Hello, ' + s); }
* 4.范型可以嵌套
* */
```

## Enum枚举

枚举是ts新增的类型，通常用来定义一组常量。Enum 结构比较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性。eg：

```typescript
// 编译前
enum Color {
  Red,     // 0
  Green,   // 1
  Blue     // 2
}
// 编译后
// let Color = {
//   Red: 0,
//   Green: 1,
//   Blue: 2
// };
// 因为enum编译后是变量，所以不能定义重名的变量（函数/对象/类等）
// Enum 成员值都是只读的，不能重新赋值。
// Color.Red = 1 // 抱错
// enum 成员可以设置初始值，如果不设置，默认从0开始
enum Color1 {Red= 1, Blue= 2}
// enum 成员值也可以设置为字符串，此时字符串枚举的所有成员值，都必须显式设置。
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Red = 3
}
// 注意：字符串 Enum 的成员值，不能使用表达式赋值。
enum MyEnum {
  A = 'one',
  B = ['T', 'w', 'o'].join('') // 报错
}
// 多个同名的 Enum 结构会自动合并，但是同名 Enum 合并时，不能有同名成员，否则报错。
// 合并时 只允许其中一个的首成员省略初始值，否则报错。也就是说 同名的enum之间 除了一个可以省略初始值，其他的都必须有。

// keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回。
enum MyEnum {
  A = 'a',
  B = 'b'
}
type Foo = keyof typeof MyEnum; // 'A'|'B'
// 如果要返回 Enum 所有的成员值，可以使用in运算符。
// type Foo = { [key in MyEnum]: any }; // { a：any, b: any }
```

## 断言

对于没有类型声明的值，TypeScript 会进行类型推断，很多时候得到的结果，未必是开发者想要的。eg：

```typescript
const username = document.getElementById('username');
  if (username) {
    // username的值可能是dom元素或者null，此时if通过之后排除了null
    // HTMLElement 类型是没有value属性的，可以断言它就是dom的input元素来获取value
  (username as HTMLInputElement).value; // 正确
}

// 类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件。expr as T
// expr是实际的值，T是类型断言，它们必须满足下面的条件：expr是T的子类型，或者T是expr的子类型。

// let和const
let s = 'JavaScript';
type Lang =
  |'JavaScript'
  |'TypeScript'
  |'Python';
function setLang(language:Lang) {}
setLang(s); // 报错，在这儿s被推断为了 类型string，string是类型Lang的父类型，父类型不能替代子类型，导致报错。
// 原因是如果没有声明变量类型，let 命令声明的变量，会被类型推断为 TypeScript 内置的基本类型之一；
// const 命令声明的变量，则被推断为值类型常量。
// 上述问题解决办法1 就是把let改为const,变量s的类型就是值类型JavaScript，它是联合类型Lang的子类型，传入函数setLang()就不会报错。
// 办法2就是 let s = 'JavaScript' as const; 断言转为const，不过as为const之后，s的值就不能改了，因为此时相当于用const定义的。
```

## declare关键字

declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。它的主要作用，就是让当前文件可以使用其他文件声明的类型。

举例来说，自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用declare关键字，告诉编译器外部函数的类型。这样的话，编译单个脚本就不会因为使用了外部类型而报错。

declare可以描述以下类型：

1. 变量（const、let、var 命令声明）

    ```typescript
    // 如果当前脚本使用了其他脚本定义的全局变量x。
    x = 123; // 变量x是其他脚本定义的，当前脚本不知道它的类型，编译器就会报错。
    // 这时使用 declare 命令给出它的类型，就不会报错了。
    declare let x:number;
    x = 1

    // 比如document全局变量
    // declare 告诉编译器，变量document的类型是外部定义的（具体定义在 TypeScript 内置文件lib.d.ts）。
    declare var document: Document;
    document.title = 'Hello';
    ```

2. type 或者 interface 命令声明的类型

    ```typescript
    declare type num = number
    declare interface T {
      a: num
    }
    let Num:num = 1
    let t:T = {
      a: Num
    }
    console.log(Num, t)
    ```

3. class

    ```typescript
    // declare class
    declare class Animal {
      constructor(name:string);
      eat():void;
    }
    ```

4. enum
5. 函数（function）

    ```typescript
    // 外部函数定义
    declare function sayHello(
      name:string
    ):void;
    ```

6. 模块（module）和命名空间（namespace）

    如果想把变量、函数、类组织在一起，可以将 declare 与 module 或 namespace 一起使用。

    ```typescript
    declare namespace AnimalLib {
      class Animal {
        constructor(name:string);
        eat():void;
        sleep():void;
      }
      type Animals = 'Fish' | 'Dog';
    }

    // 或者
    declare module AnimalLib {
      class Animal {
        constructor(name:string);
        eat(): void;
        sleep(): void;
      }
      type Animals = 'Fish' | 'Dog';
    }

    // 举例：
    // 如果我们此时用了一个外部的模块，它有makeGreeting 和numberOfGreetings方法，
    let result = myLib.makeGreeting('你好');
    let count = myLib.numberOfGreetings;

    // 此时，myLib库就可以如下描述类型
    declare namespace myLib {
      function makeGreeting(s:string): string;
      let numberOfGreetings: number;
    }
    // 同时，在使用myLib时，如果想给myLib添加属性或者方法
    // 可以使用declare给myLib添加额外的属性和方法
    declare module 'myLib' {
      interface A {a: number}
    }

    // 举例2
    // a.ts
    export interface A {
      x: number;
    }
    // b.ts
    import { A } from './a';
    // 脚本b.ts为a里面的A接口添加了属性y。
    declare module './a' {
      interface A {
        y: number;
      }
    }
    const a:A = { x: 0, y: 0 };
    // 注意点：
    // module后面的name跟 import 和 export 的模块名规则是一样的，
    // 且必须跟当前文件加载该模块的语句写法（上例import { A } from './a'）保持一致。
    // 不能创建新的顶层类型，只能对原有的进行扩展
    // 不能对默认的default接口进行扩展，只能对 export 命令输出的命名接口进行扩充。这是因为在进行类型扩展时，需要依赖输出的接口名。

    // 某些第三方模块，原始作者没有提供接口类型，这时可以在自己的脚本顶部加上下面一行命令。
    declare module "hot-new-module";
    // 外部模块即使没有类型声明，也可以通过编译。但是，从该模块输入的所有接口都将为any类型。
    ```

7. 全局变量

    ```typescript
    // declare global为 JavaScript 引擎的原生对象添加属性和方法
    // 如果文件有export {} ，文件就是作为模块，如果没有export，该文件就会作为全局的声明文件
    export {}; // 空导出语句export {}，
    // 作用是强制编译器将这个脚本当作模块处理。这是因为declare global必须用在模块里面
    declare global {
      interface String {
        toSmallString(): string;
      }
    // 给window全局扩展myAppConfig属性
      interface window {
        myAppConfig:object;
      }
    }
    // 正常String上是没有toSmallString方法的，扩展时候就可以使用了
    String.prototype.toSmallString = ():string => {
      return '';
    };
    const config = window.myAppConfig;
    ```

## ts运算符

```typescript
  // 不使用 Pick<T, K> ，实现 TS 内置的 Pick<T, K> 的功能
  interface Todo {
    title: string
    description: string
    completed: boolean
  }
  type B = 'title' | 'completed'
  // 从类型 T 中选出符合 K 的属性，构造一个新的类型
  type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
  }
  type TodoPreview = MyPick<Todo, B>

  const todo: TodoPreview = {
      title: 'Clean room',
      completed: false,
  }
```

1. keyof 是一个单目运算符，接受一个对象类型作为参数，返回该对象的所有键名组成的联合类型。

    ```typescript
      type MyObj = {
        foo: number,
        bar: string,
      };
      type Keys = keyof MyObj; // 'foo'|'bar'

      // 例子2
      interface T {
        0: boolean;
        a: string;
        b(): void;
      }
      type KeyT = keyof T; // 0 | 'a' | 'b'

      // 由于 JavaScript 对象的键名只有三种类型，所以对于任意对象的键名的联合类型就是string|number|symbol
      type KeyT = keyof any; // string | number | symbol

      // 对于没有自定义键名的类型使用 keyof 运算符，返回never类型，表示不可能有这样类型的键名
      type KeyT = keyof object;  // never，object类型没有自身的属性，也就没有键名
    ```

2. in：js中，in运算符用来确定对象是否包含某个属性名。

    ```javascript
      const obj = { a: 123 };
      if ('a' in obj)
      console.log('found a');
     ```

      TypeScript 语言的类型运算中，in运算符有不同的用法，用来取出（遍历）联合类型的每一个成员类型。

      ```typescript
      type U = 'a'|'b'|'c';
      type Foo = {
        [Prop in U]: number;
      };
      // 等同于
      type Foo = {
        a: number,
        b: number,
        c: number
      };
    ```

3. 方括号也是运算符，方括号运算符（[]）用于取出对象的键值类型，比如T[K]会返回对象T的属性K的类型。
   1. 这里需要注意：方括号里面不能有值的运算

   ```typescript
   // 示例一
    const key = 'age';
    type Age = Person[key]; // 报错

    // 示例二
    // type Age = Person['a' + 'g' + 'e']; // 报错
   ```

4. extends...?: 条件运算符: ts 提供类似 js 的?:运算符这样的三元运算符，但多出了一个extends关键字。
   1. 条件运算符extends...?:可以根据当前类型是否符合某种条件，返回不同的类型。

   ```typescript
   // 式子中的extends用来判断，类型T是否可以赋值给类型U，即T是否为U的子类型，
   // 这里的T和U可以是任意类型。
   // 如果T能够赋值给类型U，表达式的结果为类型X，否则结果为类型Y
   // T extends U ? X : Y

   // 1是number的子类型，所以返回true
   type T = 1 extends number ? true : false;

   interface Animal {
    live(): void;
   }
   interface Dog extends Animal {
    woof(): void;
   }
   // Dog是Animal的子类型，所以T1的类型是number
   type T1 = Dog extends Animal ? number : string;
   // RegExp不是Animal的子类型，所以T2的类型是string
   type T2 = RegExp extends Animal ? number : string;
   // 如果需要判断的类型是一个联合类型，那么条件运算符会展开这个联合类型。
   // (A|B) extends U ? X : Y
    // 等同于
    // (A extends U ? X : Y) | (B extends U ? X : Y)
   ```

5. infer 关键字 用来定义泛型里面推断出来的类型参数，而不是外部传入的类型参数。
   它通常跟条件运算符一起使用，用在extends关键字后面的父类型之中。

    ```typescript
    // Type extends Array<infer Item>表示，如果参数Type是一个数组，那么就将该数组的成员类型推断为Item，
    // 即Item是从Type推断出来的
    // 一旦使用Infer Item定义了Item，后面的代码就可以直接调用Item了
    type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
    // string
    type Str = Flatten<string[]>;
    // number
    type Num = Flatten<number>;

    // 如果不使用infer定义类型参数，那每次使用flatten就需要传入两个参数，比较麻烦
    type Flatten<Type, Item> = Type extends Array<Item> ? Item : Type;

    //使用infer，推断函数的参数类型和返回值类型
    // 如果T是函数，就返回这个函数的 Promise 版本，否则原样返回。
    // infer A表示该函数的参数类型为A，infer R表示该函数的返回值类型为R。
    type ReturnPromise<T> =
      T extends (...args: infer A) => infer R
        ? (...args: A) => Promise<R>
        : T;
    // 如果不使用infer，就不得不把ReturnPromise<T>写成ReturnPromise<T, A, R>，这样就很麻烦

    // 使用infer提取对象指定属性
    type MyType<T> =
      T extends {
        a: infer M,
        b: infer N
      } ? [M, N] : never;

    // 用法示例 infer提取了参数对象的属性a和属性b的类型
    type T = MyType<{ a: string; b: number }>; // [string, number]

    // infer通过匹配字符串模板提取类型参数
    type Str = 'foo-bar';
    type Bar = Str extends `foo-${infer rest}` ? rest : never // 'bar'
    ```

6. is运算符用来描述返回值属于true还是false。

    ```typescript
    // 函数返回布尔值的时候，可以使用is运算符，限定返回值与参数之间的关系。
    // 函数isFish()的返回值类型为pet is Fish，
    // 表示如果参数pet类型为Fish，则返回true，否则返回false
    function isFish(
      pet: Fish|Bird
    ):pet is Fish {
      return (pet as Fish).swim !== undefined;
    }
    ```

7. 模板字符串，ts允许使用模板字符串，构建类型。

    ```typescript
    type World = "world";
    // "hello world"
    type Greeting = `hello ${World}`;
    // 注意，模板字符串可以引用的类型一共6种，
    // 分别是 string、number、bigint、boolean、null、undefined。
    // 引用这6种以外的类型会报错

    type Num = 123;
    type Obj = { n : 123 };
    type T1 = `${Num} received`; // 正确
    type T2 = `${Obj} received`; // 报错
    ```

## 类型映射

映射（mapping）指的是，将一种类型按照映射规则，转换成另一种类型，通常用于对象类型。

```typescript
// 这两个类型的属性结构是一样的，但是属性的类型不一样。如果属性数量多的话，逐个写起来就很麻烦
type A = {
  foo: number;
  bar: number;
};
type B = {
  foo: string;
  bar: string;
};
// 使用类型映射，就可以从类型A得到类型B。
/*
* [prop in keyof A]是一个属性名表达式，表示这里的属性名需要计算得到。具体的计算规则如下：
*   prop：属性名变量，名字可以随便起。
*   in：运算符，用来取出右侧的联合类型的每一个成员。
*   Keyof A：返回类型A的每一个属性名，组成一个联合类型。
* */
type B = {
  [prop in keyof A]: string;
};
// 结果
// type B = {
//   foo: string;
//   bar: string;
// }

// 也可以复制A的原始类型
type B = {
  [prop in keyof A]: A[prop];
};
// 结果
// type B = {
//   foo: number;
//   bar: number;
// }

// 通过映射，可以修改对象的 可选、只读
type A = {
  a: string;
  b: number;
};
type B = {
  [Prop in keyof A]?: A[Prop];
};
// 结果如下，其实 ts 的内置工具类型Partial<T>，就是这样实现的
// type B = {
//   a?: string | undefined;
//   b?: number | undefined;
// }

// ts内置工具Readonly 实现如下
// 将 T 的所有属性改为只读属性
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
// 用法如下
type T = { a: string; b: number };
type ReadonlyT = Readonly<T>;
// {
//   readonly a: string;
//   readonly b: number;
// }
```

### 映射修饰符

映射会原样复制原始对象的可选属性和只读属性。如果要删改可选和只读这两个特性，并不是很方便。
为了解决这个问题，TypeScript 引入了两个映射修饰符，用来在映射时添加或移除某个属性的?修饰符和readonly修饰符。

* +修饰符：写成+?或+readonly，为映射属性添加?修饰符或readonly修饰符。
* –修饰符：写成-?或-readonly，为映射属性移除?修饰符或readonly修饰符。

```typescript
// 注意，+?或-?要写在属性名的后面
// 添加可选属性 +?修饰符可以简写成?
type Optional<Type> = {
  [Prop in keyof Type]+?: Type[Prop];
};
// 移除可选属性
type Concrete<Type> = {
  [Prop in keyof Type]-?: Type[Prop];
};
// ts的工具类型Required<T>专门移除可选属性，就是使用-?修饰符实现的

// +readonly和-readonly要写在属性名的前面
// 添加 readonly +readonly修饰符可以简写成readonly
type CreateImmutable<Type> = {
  +readonly [Prop in keyof Type]: Type[Prop];
};
// 移除 readonly
type CreateMutable<Type> = {
  -readonly [Prop in keyof Type]: Type[Prop];
};

// 如果同时增删?和readonly这两个修饰符，写成下面这样
// 增加
type MyObj<T> = {
  +readonly [P in keyof T]+?: T[P];
};
// 移除
type MyObj<T> = {
  -readonly [P in keyof T]-?: T[P];
}
```

### 键名重映射

TypeScript 4.1 引入了键名重映射（key remapping），允许改变键名。

```typescript
type A = {
  foo: number;
  bar: number;
};
type B = {
  [p in keyof A as `${p}ID`]: number;
};
// 等同于
type B = {
  fooID: number;
  barID: number;
}

// 属性过滤 键名重映射还可以过滤掉某些属性
type User = {
  name: string,
  age: number
}
type Filter<T> = {
  [K in keyof T
    as T[K] extends string ? K : never]: string
}
// 映射K in keyof T获取类型T的每一个属性以后，然后使用as Type修改键名
// as T[K] extends string ? K : never]，使用了条件运算符。如果属性值T[K]的类型是字符串，那么属性名不变，否则属性名类型改为never，即这个属性名不存在
// 只保留字符串属性
type FilteredUser = Filter<User> // { name: string }
```

## JSX

TypeScript支持内嵌，类型检查以及将JSX直接编译为JavaScript。想要使用JSX必须做两件事：

1. 给文件一个.tsx扩展名
2. 启用jsx选项

需要注意的是TypeScript在.tsx文件里禁用了使用尖括号的类型断言。

在jsx中我们可能会使用自定义标签或者自定义组件渲染，它们被称为固有元素，使用特殊的接口JSX.IntrinsicElements来查找。 默认如果这个IntrinsicElements接口没有指定，会全部通过，不对固有元素进行类型检查。然而，如果这个接口存在，那么固有元素的名字需要在JSX.IntrinsicElements接口的属性里查找。 例如：

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}
// <foo />没有问题，但是<bar />会报错，因为它没在JSX.IntrinsicElements里指定
<foo />; // 正确
<bar />; // 错误
// 当然也可以在JSX.IntrinsicElements上指定一个用来捕获所有字符串索引
// declare namespace JSX {
//     interface IntrinsicElements {
//         [elemName: string]: any;
//     }
// }

// 上面 foo: any表示 组件foo接收任何类型的参数，如果想明确参数类型，需要如下定义：
declare namespace JSX {
    interface IntrinsicElements {
    foo: { bar?: boolean }
    }
}
// `foo`的元素属性类型为`{bar?: boolean}`
<foo bar />;
```

### 无状态函数组件

正如其名，组件被定义成JavaScript函数，它的第一个参数是props对象。 TypeScript会强制它的返回值可以赋值给JSX.Element。

```typescript
interface FooProp {
    name: string;
    X: number;
    Y: number;
}
declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
    return <AnotherComponent name={prop.name} />;
}
const Button = (prop: {value: string}, context: { color: string }) => <button>

// 由于无状态函数组件是简单的JavaScript函数，所以我们还可以利用函数重载。
interface ClickableProps {
    children: JSX.Element[] | JSX.Element
}
interface HomeProps extends ClickableProps {
    home: JSX.Element;
}
interface SideProps extends ClickableProps {
    side: JSX.Element | string;
}
function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
    ...
}
```

## TS内置的类型工具

1. Awaited < Type >

    ```typescript
    // 用来取出 Promise 的返回值类型，适合用在描述then()方法和 await 命令的参数类型。
    type A = Awaited<Promise<string>>; // string

    // 可以返回多重 Promise 的返回值类型
    type B = Awaited<Promise<Promise<number>>>; // number

   // 如果它的类型参数不是 Promise 类型，那么就会原样返回
   type C = Awaited<boolean | Promise<number>>; // number | boolean
    ```

2. ConstructorParameters< Type >

   ```typescript
   // 提取构造方法Type的参数类型，组成一个元组类型返回。
   type T1 = ConstructorParameters<
    new (x: string, y: number) => object
    >; // [x: string, y: number]

    type T2 = ConstructorParameters<
    new (x?: string) => object
    >; // [x?: string | undefined]
   ```

3. Exclude<UnionType, ExcludedMembers>

    ```typescript
   // 用来从联合类型UnionType里面，删除某些类型ExcludedMembers，组成一个新的类型返回
   type T1 = Exclude<'a'|'b'|'c', 'a'>; // 'b'|'c'
    type T2 = Exclude<'a'|'b'|'c', 'a'|'b'>; // 'c'
    type T3 = Exclude<string|(() => void), Function>; // string
    type T4 = Exclude<string | string[], any[]>; // string
    type T5 = Exclude<(() => void) | null, Function>; // null
    type T6 = Exclude<200 | 400, 200 | 201>; // 400
    type T7 = Exclude<number, boolean>; // number
   ```

4. Extract<Type, Union>

    ```typescript
   // 用来从联合类型UnionType之中，提取指定类型Union，组成一个新类型返回。它与Exclude<T, U>正好相反
   type T1 = Extract<'a'|'b'|'c', 'a'>; // 'a'
    type T2 = Extract<'a'|'b'|'c', 'a'|'b'>; // 'a'|'b'
    type T3 = Extract<'a'|'b'|'c', 'a'|'d'>; // 'a'
    type T4 = Extract<string | string[], any[]>; // string[]
    type T5 = Extract<(() => void) | null, Function>; // () => void
    type T6 = Extract<200 | 400, 200 | 201>; // 200
   ```

5. InstanceType< Type >

    ```typescript
   // 提取构造函数的返回值的类型（即实例类型），参数Type是一个构造函数，等同于构造函数的ReturnType<Type>。
   type T = InstanceType<
     new () => object
   >; // object
   type A = InstanceType<ErrorConstructor>; // Error
    type B = InstanceType<FunctionConstructor>; // Function
    type C = InstanceType<RegExpConstructor>; // RegExp
   ```

6. NonNullable< Type >

    ```typescript
   // 用来从联合类型Type删除null类型和undefined类型，组成一个新类型返回，也就是返回Type的非空类型版本。
   // string|number
    type T1 = NonNullable<string|number|undefined>;

    // string[]
    type T2 = NonNullable<string[]|null|undefined>;

    type T3 = NonNullable<boolean>; // boolean
    type T4 = NonNullable<number|null>; // number
    type T5 = NonNullable<string|undefined>; // string
    type T6 = NonNullable<null|undefined>; // never
   ```

7. Omit<Type, Keys>

    ```typescript
   // 用来从对象类型Type中，删除指定的属性Keys，组成一个新的对象类型返回。
   interface A {
    x: number;
    y: number;
   }
    type T1 = Omit<A, 'x'>;       // { y: number }
    type T2 = Omit<A, 'y'>;       // { x: number }
    type T3 = Omit<A, 'x' | 'y'>; // { }
   ```

8. OmitThisParameter< Type >

    ```typescript
    // 从函数类型中移除 this 参数
   function toHex(this: Number) {
    return this.toString(16);
   }
    type T = OmitThisParameter<typeof toHex>; // () => string
    ```

9. Parameters< Type >

    ```typescript
    // 从函数类型Type里面提取参数类型，组成一个元组返回。
   type T1 = Parameters<() => string>; // []
    type T2 = Parameters<(s:string) => void>; // [s:string]
    type T3 = Parameters<<T>(arg: T) => T>;    // [arg: unknown]
    type T4 = Parameters<
    (x:{ a: number; b: string }) => void
    >; // [x: { a: number, b: string }]
    type T5 = Parameters<
    (a:number, b:number) => number
    >; // [a:number, b:number]
    ```

10. Partial< Type >

    ```typescript
    // 返回一个新类型，将参数类型Type的所有属性变为可选属性。
    interface A {
      x: number;
      y: number;
    }
    type T = Partial<A>; // { x?: number; y?: number; }
    ```

11. Pick<Type, Keys>

    ```typescript
    // 返回一个新的对象类型，第一个参数Type是一个对象类型，第二个参数Keys是Type里面被选定的键名。
    interface A {
      x: number;
      y: number;
    }
    type T1 = Pick<A, 'x'>; // { x: number }
    type T2 = Pick<A, 'y'>; // { y: number }
    type T3 = Pick<A, 'x'|'y'>;  // { x: number; y: number }
    ```

12. Readonly< Type >

    ```typescript
    // 返回一个新类型，将参数类型Type的所有属性变为只读属性。
    interface A {
      x: number;
      y: number;
    }
    // { readonly x: number; readonly y?: number; }
    type T = Readonly<A>;
    ```

13. Record<Keys, Type>

    ```typescript
    // 返回一个对象类型，参数Keys用作键名，参数Type用作键值类型。
    // { a: number }
    type T = Record<'a', number>;
    ```

14. Required< Type >

    ```typescript
    // 返回一个新类型，将参数类型Type的所有属性变为必选属性。它与Partial<Type>的作用正好相反
    interface A {
      x?: number;
      y: number;
    }
    type T = Required<A>; // { x: number; y: number; }
    ```

15. ReadonlyArray< Type >

    ```typescript
    // 用来生成一个只读数组类型，类型参数Type表示数组成员的类型。
    const values: ReadonlyArray<string>  = ['a', 'b', 'c'];

    values[0] = 'x'; // 报错
    values.push('x'); // 报错
    values.pop(); // 报错
    values.splice(1, 1); // 报错
    ```

16. ReturnType< Type >

    ```typescript
    // 提取函数类型Type的返回值类型，作为一个新类型返回
    type T1 = ReturnType<() => string>; // string
    type T2 = ReturnType<() => {
    a: string; b: number
    }>; // { a: string; b: number }
    type T3 = ReturnType<(s:string) => void>; // void
    type T4 = ReturnType<() => () => any[]>; // () => any[]
    type T5 = ReturnType<typeof Math.random>; // number
    type T6 = ReturnType<typeof Array.isArray>; // boolean
    ```

17. ThisParameterType< Type >

    ```typescript
    // 提取函数类型中this参数的类型。
    function toHex(this: Number) {
      return this.toString(16);
    }
    type T = ThisParameterType<typeof toHex>; // number
    ```

18. ThisType< Type >

    ```typescript
    // 不返回类型，只用来跟其他类型组成交叉类型，用来提示 TypeScript 其他类型里面的this的类型。
    interface HelperThisValue {
      logError: (error:string) => void;
    }
    let helperFunctions:
    { [name: string]: Function } &
    ThisType<HelperThisValue>
    = {
      hello: function() {
        this.logError("Error: Something wrong!"); // 正确
        this.update(); // 报错
      }
    }
    ```

19. 字符串类型工具

    1. ```Uppercase<StringType>```

        ```typescript
        // 将字符串类型的每个字符转为大写。
        type A = 'hello';
        // "HELLO"
        type B = Uppercase<A>;
        ```

    2. ```Lowercase<StringType>``` 将字符串的每个字符转为小写

    3. ```Capitalize<StringType>``` 将字符串的第一个字符转为大写。

    4. ```Uncapitalize<StringType>``` 将字符串的第一个字符转为小写。

## 注释指令

所谓“注释指令”，指的是采用 JS 双斜杠注释的形式，向编译器发出的命令。

1. @ts-nocheck
    告诉编译器不对当前脚本进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本
2. @ts-check
   如果一个 JavaScript 脚本顶部添加了// @ts-check，那么编译器将对该脚本进行类型检查，不论是否启用了checkJs编译选项。
3. @ts-ignore
   诉编译器不对下一行代码进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本
4. @ts-expect-error
5. JSDoc：TypeScript 直接处理 JS 文件时，如果无法推断出类型，会使用 JS 脚本里面的 JSDoc 注释。

    ```typescript
   // JSDoc 注释必须以/**开始，其中星号（*）的数量必须为两个。
   // 若使用其他形式的多行注释，则 JSDoc 会忽略该条注释。
   // JSDoc 注释必须与它描述的代码处于相邻的位置，并且注释在上，代码在下
    /**
     * @param {string} [somebody='1']
     */
    function sayHello(somebody) {
      console.log('Hello ' + somebody);
    }
    ```

   1. @typedef命令创建自定义类型，等同于 TypeScript 里面的类型别名。 @typedef {(number | string)} NumberLike
   2. @type命令定义变量的类型。
      1. @type {string}
      2. @type {(s: string, b: boolean) => number}允许使用 TypeScript 类型及其语法
   3. @param命令用于定义函数参数的类型。方括号里面，还可以指定参数默认值：@param {string} [x="bar"]
   4. @return和@returns命令的作用相同，指定函数返回值的类型。
   5. @extends命令用于定义继承的基类。

## tsconfig.json

如果一个目录下存在一个tsconfig.json文件，那么它意味着这个目录是TypeScript项目的根目录。 tsconfig.json文件中指定了用来编译这个项目的根文件和编译选项。
"files"指定一个包含相对或绝对文件路径的列表。 "include"和"exclude"属性指定一个文件glob匹配模式列表。

```json
{
    "compilerOptions": {
        "module": "system", // 指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"。
        "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错。
        "removeComments": true, // 删除所有注释，除了以 /!*开头的版权信息。
        "preserveConstEnums": true, // 保留 const和 enum声明。
        "outFile": "../../built/local/tsc.js", // 将输出文件合并为一个文件。
        "sourceMap": true // 生成相应的 .map文件。
    },
    "files": [
        "core.ts",
        "sys.ts"
    ],
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ]
}
```

## lib.d.ts

安装 TypeScript 时，会顺带安装一个 lib.d.ts 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。

* 它自动包含在 TypeScript 项目的编译上下文中；
* 它能让你快速开始书写经过类型检查的 JavaScript 代码。

lib.d.ts 的内容主要是一些变量声明（如：window、document、math）和一些类似的接口声明（如：Window、Document、Math）。eg：

```typescript
interface Window
  extends EventTarget,
    WindowTimers,
    WindowSessionStorage,
    WindowLocalStorage,
    WindowConsole,
    GlobalEventHandlers,
    IDBEnvironment,
    WindowBase64 {
  animationStartTime: number;
  applicationCache: ApplicationCache;
  clientInformation: Navigator;
  closed: boolean;
  crypto: Crypto;
  // so on and so forth...
}
declare var window: Window;
```
