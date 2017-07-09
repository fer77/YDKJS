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
a(1);

function a(foo) {
  if (foo > 20) return foo;
  return b(foo + 2);
}
function b(foo) {
  return c(foo) + 1;
}
function c(foo) {
  return a(foo * 2);
}
```
