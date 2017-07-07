// 1. Identify all the LHS look-ups (there are 3!).
// 2. Identify all the RHS look-ups (there are 4!).

function foo(a) { // LHS#2 is there a ref for a?
	var b = a; // LHS#3 is there a ref for b?
            // RHS #2 is there a ref for a?
	return a + b; // RHS#3 & 4 is there a ref for a & b?
}

var c = foo( 2 ); // LHS#1 is there a ref for var c?
                // RHS#1 is there a ref for foo?
