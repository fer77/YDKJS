## Scope
---

```javascript
// The first pass(compilation phase) of the JS engine looks for all the variable declarations(var, function...).
// Second pass(execution phase).
// LHS(left hand side) and RHS (right hand side) of an assignment (=), otherwise target(LHS) and source(RHS).

// Global scope, var foo.
var foo = 'bar'; // This is not a single statement, but separate statements(passes).

// Global scope function bar.
// Nothing inside this function is executed, because it hasn't been called.  The JS engine moves on, until it needs to execute this function.
function bar() {
  //bar scope, var foo.
  var foo = 'baz';
}

// Global scope, baz
function baz(foo) {
  // baz scope, var foo.
  foo = 'bam';
  bam = 'yay'; // This assigns to a global variable, because it wasn't declared anywhere the JS engine creates it for us (leakage).
}

foo; // global RHS 'bar'
bam; // global RHS 'yay'
baz(); // results in a reference error (Error!), because there is no identifier named baz() in the global scope.
```

**Undefined** means that the JS engine found or created a declaration, but was unable to find a reference in any scope.

**Undeclared** is when there is no declaration for a variable.

## Function Declarations & Function Expressions
---

A function _declaration_ is when the function keyword is the very first word in the statement.

Function _expressions_ start with _var_.  Expressions are usually anonymous function expressions, `var foo = function() {}`.
  Three cons for using anonymous function expressions:

  1. No way to reference itself.
  2. Hard to debug, because the only name to reference it by is "anonymous".
  3. Self documents code.  What is it that it does `var foo = function sneeze() {...}`.

  A _named function expression_ `var foo = function bar() {}`. the "bar" name does not get declared in the outer scope, but it exists and can be referenced inside itself.

```javascript
var foo = function bar() {
  var foo = 'baz';
  function baz(foo) {
    foo = bar;
    foo; // function...
  }
  baz();
};

foo();
bar(); // Error!
```

## Lexical Scope
---

**lexical scope** compile(lex) time scope. The compiler decides what the scope is set at this point.
**dynamic scope** Not used in JS or in other common programming languages.  Dynamic scope is used in bash.

## IIFE Pattern
---

The surrounding () in an IIFE makes a function an expression and not a declaration.

```javascript
var = 'foo';

(function() {
  var foo = 'foo2';

  console.log(foo); // "foo2"
})();

console.log(foo); // "foo"
```

An IFFE is a function call, which means we can pass things to it.

```javascript
var = 'foo';

(function(bar) //($) {
  var foo = 'bar';

  console.log(foo); // "foo"
})(foo); // This could be passed (jQuery) and named it ($) in the function.

console.log(foo); // "foo"
```

An IFFE pattern is a way to manually pass in alias variables from the enclosing scope.

`let` keyword will explicitly "highjack" the scope where the declaration is created rather than to the enclosing function.
the `let` keyword does not "hoist"

## Review
---

What type of scoping does JS have? Exceptions?
_lexical scope._  `eval()` _and_ `with` _keyword._

What ways can be used to create scope?
_functions,_ `try` `catch` `{let...}` _keyword_

Undeclared vs Undefined
_Undefined does not currently have a value(empty place holder), but there is a declared variable.  Undeclared has never been declared(reference error)._

## Hoisting
---

Does not exist, it is a mental way or conceptual model to think of in JS.

Declarations of variables and functions are "hoisted" to the top of the code (`let` do not "hoist").  What this means is that all the LHS happens at compile time and RHS happens during execution.

```javascript
var a = b(); // will return undefined because "c" in function b hasn't been declared yet.
var c = d(); // will return undefined.

// function declarations get "hoisted" (function b()), but function expressions (var d = function()) do not.

a; // ???
c; // ???

function b() {
  return c;
}

var d = function() {
  return b;
};
```

This is how "hoisting" works for the block above:

```javascript
// functions are hoisted to the top...
function b() {
  return c;
}
// then our variables
var a;
var b;
var c;
// then code is executed;
a = b();
c = d();
a; // ???
c; // ???
d = function() {
  return b;
};
```

**Recursion** when a function calls itself.
**mutual recursion** two or more functions calling each other.

This would be impossible without the concept of hoisting:

```javascript
a(1); // 39 (36 + 1 + 1 + 1)

function a(foo) {
  if (foo > 20) return foo;
  return b(foo + 2);
}
function b(foo) {
  return c(foo) + 1; // This +1 is added to the stack three times and added to the ending result.
}
function c(foo) {
  return a(foo * 2);
}
```

## 'this' Keyword
---

_lexical scoping model_ is an author time decision.

**this**: every function, while executing has a reference to its current execution content.  `this` is dependent on the _call site_.

**hard binding**:

```javascript
function foo() {
  console.log(this.bar);
}

  var obj = { bar: 'bar' };
  var obj2 = { bar: 'bar2' };

  var orig = foo;
  foo = function() { orig.call(obj); };

  foo();            // "bar"
  foo.call(obj2);   // "bar"
```

The above _hard binding_ can be made a _utility_ to create a whole new function:

```javascript
if(!Function.prototype.bind2) {
  Function.prototype.bind2 = function(o) {
    var fn = this; // the function

    return function() {

      return fn.apply(o, arguments);
    };
  };
}

function foo(baz) {
  console.log(this.bar + ' ' + baz);
}

var obj = { bar: 'bar' };
foo = foo.bind2(obj);

foo('baz'); // "bar baz"
```

Four rules for how the _this_ keyword is bound:

1. **new** binding.  It overwrites any of the other rules.
Four things the _new_ keyword does when used in front of a function call:

    1. a brand new empty object will be created.

    2. that new empty object is linked to a another object. *

    3. that new empty object also gets bound to the `this` keyword for that function call.

    4. if that function does not return anything, it will implicitly incert a `return this`.  So that new empty object will be returned.

2. **explicit binding rule** Applies when the _call siste_ uses `.call()` or `.apply()`, both utilities take as their first parameter a `this` binding (_thisArg, ..._).  `foo.call(obj);` This says explicitly, use _obj_ as `this`.

```javascript
function foo() {
  console.log(this.bar);
}

var bar = 'bar1';
var obj = { bar: 'bar2' };

foo();            // "bar1"
foo.call(obj);    // "bar2"
```

3. **implicit binding rule** Applies when the _call site_ has an _object property reference_ like this `o2.foo();`.  The _base object_ or _context object_(_owning_ or _containing object_), becomes the `this` keyword.

4. **defult binding rule** Applies when the _call site_ looks like this: `foo();` or `(function() {})();` (_IIFE_).  If you're in strict mode, the default `this` keyword is an _undefined_ value. If not in strict mode the default `this` keyword is the _global object_ `foo();`.

```javascript
function foo() {
  console.log(this.bar);
}

var bar = 'bar1';
var o2 = { bar: 'bar2', foo: foo };
var o3 = { bar: 'bar3', foo: foo };

foo();      // "bar1"
o2.foo();   // "bar2"
03.foo();   // "bar3"
```

**call site** the place where the code is executed with its ().  It doesn't matter where the function is declared or the order.

```javascript
var o1 = {
  bar: 'bar1',
  foo: function() {
    console.log(this.bar);
  }
};

var o2 = { bar: 'bar2', foo: o1.foo };
var bar = 'bar3';
var foo = o1.foo;

o1.foo();   // "bar1"
o2.foo();   // "bar2"
foo();      // "bar3"
```

Questions to ask, after finding the _call site_, about the `this` key word, in order:

1. was the function called with `new`? if so use that object.

2. was the function called with `call` or `apply` specifying an explicit `this`? if so use that object.

3. was the function called via a containing/owning object (context)?

4. DEFAULT: global object (_except strict mode_).

## Closure
---

>_Closure is when a function "remembers" its lexical scope even when the function is executed outside that lexical scope._

```javascript
function foo() {
  var bar = 'bar';

  function baz() {
    console.log(bar);
  }
  bam(baz);
}

function bam(baz) {
  baz();            // "bar"
}

foo();
```

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log('i: ' + i);
    }, i * 1000);
} // i: 6
```

This creates a whole difrent scope for each iteration rather than over the whole global scope:

```javascript
for (var i = 1; i <= 5; i++) {
  // put an IIFE inside of the loop
  (function(i) {
    setTimeout(function() {
      console.log('i: ' + i);
      }, i * 1000);
    })(i);
}
```

`let` binds the _i_ not just to the _for loop_, it rebinds the _i_ for each iteration of the _for loop_.

```javascript
// Works without an IIFE
for (let i = 1; i < 5; i++) {
  setTimeout(function() {
    console.log('i ' + i);
    }, i * 1000);
}
```

For closure to be a closure it has to transport out a function.  This looks like closure, but it is keeping an object reference:

```javascript
var foo = (function() {
  var o = { bar: 'bar' };

  return { obj: o };
  })();

  console.log(foo.obj.bar);   // "bar"
```

Principle of least privilage or  the **classic module pattern** has two characteristics to it:

1. There must be an outer wrapping function that gets executed, not necessarily an IIFE.

2. There must be one or more inner functions that get returned from the function call, that have a closure over the inner private scope.

```javascript
var foo = (function() {
  var o = { bar: 'bar' };

  return {
    bar: function() {
      console.log(o.bar);
    }
  };
  })();

  foo.bar();    // "bar"
```

_modified module pattern_ both `foo` and `publicAPI` have references to the same object:

```javascript
var foo = (function() {
  var publicAPI = {
    bar: function() {
      publicAPI.baz();
    },
    baz: function() {
      console.log('baz');
    }
  };

  return publicAPI;
  })();

  foo.bar();    // "baz"
```

## Object-Oriented
---

Every single "object" is built by a constructor function (constructor call).

A constructor makes an object _linked to_ its own prototype.

**Prototypes**

`.prtotype`

`[[Prototype]]` private link, public only to `__prototype__`.

`__prototype__` _dunderproto_ "getter" function.  Returns the internal prototype linkage of whatever the `this` binding is. 


```javascript
function Foo(who) {
  this.me = who;
}

Foo.prototype.identify = function() {
  return 'I am ' + this.me;
}

var a1 = new Foo('a1');
var a2 = new Foo('a2');

a2.speak = function() {
  alert('Hello ' + this.identify() + '.');
};

a1.__prototype__ === Object.getPrototypeOf(a1);
a1.constructor === Foo;
a1.constructor === a2.constructor;
a1.__proto__ === Foo.prototype;
a1.__proto__ === a2.__proto__;
a2.__proto__ === a2.constructor.prototype;
```

Four things the _new_ keyword does when used in front of a function call:

  1. a brand new empty object will be created.

  2. that new empty object is linked to a another object. *

  3. that new empty object also gets bound to the `this` keyword for that function call.

  4. if that function does not return anything, it will implicitly incert a `return this`.  So that new empty object will be returned.

```javascript
  function Foo(who) {
    this.me = who;
  }

  Foo.prototype.identify = function() {
    return 'I am ' + this.me;
  };

  var a1 = new Foo(a1);
  a1.identify(); // "I am a1"

  a1.identify = function() { // <-- Shadowing
    alert('Hello, ' + Foo.prototype.identify.call(this) + '.');
  };

  a1.identify(); // "Hello I am a1"
```

It is important to name our methods diffrently than the prototype properties.

```javascript
  function Foo(who) {
    this.me = who;
  }

  Foo.prototype.identify = function() {
    return 'I am ' + this.me;
  };

  Foo.prototype.speak = function() {
    alert('Hello, ' + this.identify() + '.'); // Super unicorn magic
  }

var a1 = new Foo('a1');
a1.speak; // "Hello, I am a1."
```

Delegation as a JS design pattern instead of classes.

`Object.create` does the first two things the `new` keyword does.

1. a brand new empty object will be created.

2. that new empty object is linked to a another object. *
  

#### Review
---

**constructor** A function that is called with the `new` keyword infront of it, a constructor call.  `.constructor` is a property and not the same thing.

**[[Prototype]]** A link[age] from one obj to another obj.  We get that link from `Object.create` or indirectly from step #2.  If an obj can't find a property or method reference it delegates up the prototype chain.

Three ways to find where _[[Prototype]]_ points to:

1. `__prototype__` _dunderproto_

2. `Object.getPrototypeOf`

3. `.constructor.prototype`