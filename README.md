# finite-automata

## Overview

finite-automata is an interface to build both Deterministic (DFA) and Nondeterministic (NFA) Finite Automata for Strings and iterated through by character.

The Class Structures are based on the definitions found in [Michael Sipser's Introduction to the Theory of Computation](http://math.mit.edu/~sipser/book.html), in which the following are defined:

### Deterministic Finite Automaton

```text
A finite automaton is a 5-tuple (Q, Σ, δ, q0, F ), where
1. Q is a finite set called the states,
2. Σ is a finite set called the alphabet,
3. δ : Q × Σ−→ Q is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.
```

### Nondeterministic Finite Automaton

```text
A nondeterministic finite automaton is a 5-tuple (Q,Σ,δ,q0,F), where
1. Q is a finite set of states,
2. Σ is a finite alphabet,
3. δ : Q × Σε −→ P (Q) is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.
```

## Implementation

### Details

The DFA and the NFA implementation are split into two files, [`dfa.ts`](https://github.com/syall/finite-automata/blob/master/dfa.ts) and [`nfa.ts`](https://github.com/syall/finite-automata/blob/master/nfa.ts) and are written in TypeScript.

Both are ES6 Classes, interfaced in two ways:

* `instance = new constructor(q, a, s, d, f)` in which there is code that validates that the arguments passed in are valid, otherwise throwing an `Error`
* `instance.run(input)` in which an input string is iterated by character, returning `true` if the input is accepted or `false` otherwise

Once a Automaton is created, it is recommended not to alter the properties of the object, as there is no guarantee that the constraints of the Automaton would be valid afterwards.

### dfa.ts

In the [definition](#deterministic-finite-automaton), the class implementations are:

Definition | Class | type
---       | ---   | ---
Q         | q     | Set of Strings
Σ         | a     | Set of Strings
δ         | d     | Map of Strings => (Map of Strings => String)
q0        | s     | String
F         | f     | Set of Strings

Example:

```typescript
import { DFA } from 'path/to/dfa.ts';

// DFA describing 0*(101*)?
const dfa = new DFA(
    new Set(['1', '2', '3']),   // States { 1, 2, 3 }
    new Set(['0', '1']),        // Alphabet { 0, 1 }
    new Map([                   // Transition Functions
        ['1', new Map([         // If at State 1
            ['0', '1'],         //    Input 1 → State 1
            ['1', '2']          //    Input 2 → State 2
        ])],
        ['2', new Map([         // If at State 2
            ['0', '3'],         //    Input 0 → State 3
        ])],
        ['3', new Map([         // If at State 3
            ['1', '3'],         //    Input 0 → State 3
        ])],
    ]),
    '1',                        // Start at State 1
    new Set(['1', '3'])         // Accept States { 1, 3 }
)

// Tests
console.log(dfa.run('10'))             // Expect true
console.log(dfa.run(''))               // Expect true
console.log(dfa.run('00000010111111')) // Expect true
console.log(dfa.run('111'))            // Expect false
```

### nfa.ts

In the [definition](#nondeterministic-finite-automaton), the class implementations are:

Definition | Class | type
---       | ---   | ---
Q         | q     | Set of Strings
Σ         | a     | Set of Strings
δ         | d     | Map of Strings => (Map of Strings => Set of Strings)
q0        | s     | String
F         | f     | Set of Strings

Example:

```typescript
import { NFA } from 'path/to/nfa.ts';

// NFA describing a|b in Thompson's Construction
const nfa = new NFA(
    new Set([
        '1', '2',
    // ↗         ↘
    's',         'f',           // Thompson's Construction for a|b
    // ↘         ↗
        '3', '4'
    ]),
    new Set(['a', 'b']),        // Alphabet { a, b }
    new Map([                   // Transition Functions
        // If at State s
        ['s', new Map([
            // Input '' → State 1 and 3
            ['', new Set(['1', '3'])],
        ])],
        // If at State 1
        ['1', new Map([
            // Input 'a' → State 2
            ['a', new Set(['2'])],
        ])],
        // If at State 3
        ['3', new Map([
            // Input 'b' → State 4
            ['b', new Set(['4'])],
        ])],
        // If at State 2
        ['2', new Map([
            // Input '' → State f
            ['', new Set(['f'])],
        ])],
        // If at State 4
        ['4', new Map([
            // Input '' → State f
            ['', new Set(['f'])],
        ])],
    ]),
    's',                        // Start at State s
    new Set(['f'])              // Accept States { f }
)

// Tests
console.log(nfa.run('c'))              // Expect false
console.log(nfa.run('a'))              // Expect true
console.log(nfa.run('b'))              // Expect true
console.log(nfa.run('ab'))             // Expect false
```

## Personal Notes

### Development

### Lectures


