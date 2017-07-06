## Scope

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
```

**Undefined** means that the JS engine found or created a declaration, but was unable to find a reference in any scope.

**Undeclared** is when there is no declaration for a variable.
