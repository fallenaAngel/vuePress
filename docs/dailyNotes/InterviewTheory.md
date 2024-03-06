# 面试理论

## JavaScript

### JS的组成

ECMAScript，BOM（浏览器模型），DOM（文档对象模型）。

### ES6新增特性

- 块级作用域，let，const
  - 不存在变量提升，有块级作用域概念，不能在同一个块级作用域重复声明
- 类语法糖class
- 基本数据类型Symbol
- 解构赋值，扩展运算符，函数参数默认值
- 数组新增API
- generator，* yield
  - 协程，多个线程互相协作，完成异步任务。

  ```js
  function * fun(x) {
    console.log('start')
    yield x * 2
    return x
  }
  const f = fun(1)// 此时不会立即执行
  f.next() // 此时开始执行，输出start
  ```

- Promise
  - 异步编程方案，解决回调地狱问题，原型上有then、catch，链式调用把异步操作队列化
  - ES7提供了async、await，进一步通过同步函数的方式支持异步编程。
- 模块化，import，export
- Set、Map数据结构
  - Map结构是二维数组，是 ```key:value```键值对，可以使用```set、get、delete、has```等方法操作，它的key可以是任意类型。
  - Set的值就是key，没有value，value就是key，可以使用```[...new Set(arr)]```给数组去重。
- 箭头函数
  - 不能作为构造函数使用，不能使用new，没有arguments关键字，不能使用call、apply、bind改变this指向。
  - this指向外层第一个函数的this
  - 没有原型，箭头函数.prototype为undefined

### 检查数据类型

1. typeof，一般用来检查基本数据类型。
2. instanceof，一般用来检查引用数据类型。
3. constructor，可以检查基本和引用数据类型，但是如果修改了原形，就会导致结果错误。
4. Object.prototype.toString.call()，可以检查所有数据类型。

### 闭包

什么是闭包？函数嵌套函数，内部函数被外部函数返回并保存下来时，就会产生闭包。
特点：可以重复利用变量，并且变量不会污染全局，一直保存在内存中，不会被回收。

缺点：闭包多时，会消耗内存，影响性能，IE浏览器中会导致内存泄漏。

使用场景：防抖，节流。

### 内存泄漏

因为垃圾回收机制，js里面已经分配内存地址的对象，长时间占用内存，无法释放，导致运行速度慢，甚至崩溃。

因素：过度闭包、未清除的定时器。

### 事件委托，冒泡和捕获

事件委托又叫事件代理，利用时间冒泡机制，字元素的事件会冒泡到父元素，直接在父元素绑定事件，就可以通过e.target拿到当前触发事件的子元素。子元素本身可以用e.stopPropagation()阻止冒泡。

优点：提高性能，减少事件绑定，减少内存占用。

父元素绑定事件可以用addEventListener(eventName, funcName, true/false)，第三个参数 默认是false冒泡，可以设置为true捕获。

e.target是触发的元素，e.currentTarget是绑定的元素。假如有abcd四层元素，第三个参数为false，点击时，target和currentTarget值分别是 dddd和 dcba。如果第三个参数是true，值分别是 dddd和abcd。这是冒泡和捕获的区别。

### 原型，原型链

原形prototype，只有函数有，其他类型没有。__proto__指针，所有类型都有，指向构造函数的原形，每一层的指针组成了原型链。

### object的方法

- Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。同名属性会替换。
- Object.create(parent, {z : { writable:true, configurable:true, value: "newAdd"} }) 使用指定的原型对象及其属性去创建一个新的对象。
- Object.defineProperty(Object , ‘is’,{value:’a’, configurable:true, enumerable: false, writable: true}) 在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
- Object.keys(obj) ，Object.values(obj)，Object.entries(obj)返回一个由一个给定对象的自身可枚举属性/属性值/键值对组成的数组，排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致。与for in的区别是for in循环会枚举原型链上的属性。
- obj.hasOwnProperty('name') 判断对象自身属性中是否具有指定的属性。
- Object.getPrototypeOf()返回指定对象的原型（内部[[Prototype]]属性的值，即__proto__，而非对象的prototype。
- Object. isPrototypeOf()判断一个对象是否存在于另一个对象的原型链上。
- Object.setPrototypeOf(obj,prototype) 设置对象的原型对象。
- Object.is()判断两个值是否相同。如果两个值都是undefined/null/true/false/NaN/指向同一个对象，则两个值相同。

### script标签上的属性

script标签上没有async和defer属性时，浏览器会立刻加载并执行脚本。

如果有async属性，加载和渲染后面元素的过程将和script的加载和执行并行（异步）。如果有defer属性，会跟async一样，异步加载，但是会在所有元素解析完成之后才去执行。

### setTimeOut最小执行时间

在 JavaScript 中，setTimeout 函数的最小执行时间取决于浏览器或者宿主环境的实现。根据 HTML 标准，规定 setTimeout 的最短时间间隔是 4 毫秒，也就是说，指定的回调函数至少会在指定时间之后的 4 毫秒内执行。setInterval最小10ms。

### call、apply、bind

都是改变this指向和函数的调用，call和apply功能类似，只是传参数的方法不同。
call传递的是参数列表，apply传递的是数组。
bind传递参数之后不会立即执行，它会返回一个改变了this指向的函数，这个函数还是可以传参数，所以它需要bind()()。

call的性能比apply好一点，所以call用的多，可以用扩展运算符代替apply。
