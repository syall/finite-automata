# finite-automata

## Overview

finite-automata is an Class Interface to build both Deterministic (DFA) and Nondeterministic (NFA) Finite Automata for Strings which are iterated through by character.

The Class Structures are based on the definitions found in [Michael Sipser's Introduction to the Theory of Computation](http://math.mit.edu/~sipser/book.html), in which the following are defined:

### Deterministic Finite Automaton

```text
A finite automaton is a 5-tuple (Q, Σ, δ, q0, F), where
1. Q is a finite set called the states,
2. Σ is a finite set called the alphabet,
3. δ: Q × Σ → Q is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.
```

### Nondeterministic Finite Automaton

```text
A nondeterministic finite automaton is a 5-tuple (Q, Σ, δ, q0, F), where
1. Q is a finite set of states,
2. Σ is a finite alphabet,
3. δ: Q × Σε −→ P(Q) is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.
```

## Implementation

### Details

The DFA and the NFA implementation are split into two files, [`dfa.ts`](https://github.com/syall/finite-automata/blob/master/dfa.ts) and [`nfa.ts`](https://github.com/syall/finite-automata/blob/master/nfa.ts) and are written in TypeScript.

Both are ES6 Classes, interfaced in two ways:

* `instance = new constructor(q, a, s, d, f)` in which there is code that validates that the arguments passed in are valid for a finite automaton, otherwise throwing an `Error`
* `instance.run(input)` in which an `input` string is iterated by character, returning `true` if the input is accepted or `false` otherwise

Once a Automaton is created, it is recommended not to alter the existing properties of the object, as there is no guarantee that the constraints of the Automaton would be valid afterwards.

### dfa.ts

In the [definition](#deterministic-finite-automaton), the class implementations are:

Definition | Class | type
----------|-------|----------------------------------------------
Q         | q     | Set of Strings
Σ         | a     | Set of Strings
δ         | d     | Map of String => (Map of String => String)
q0        | s     | String
F         | f     | Set of Strings

Example:

```typescript
import { DFA } from 'path/to/dfa.ts';

// DFA describing 0*(101*)?
const dfa = new DFA(
    // States { 1, 2, 3 }
    new Set(['1', '2', '3']),
    // Alphabet { 0, 1 }
    new Set(['0', '1']),
    // Transition Functions
    new Map([
        // If at State 1
        ['1', new Map([
            // Input 1 → State 1
            ['0', '1'],
            // Input 2 → State 2
            ['1', '2']
        ])],
        // If at State 2
        ['2', new Map([
            // Input 0 → State 3
            ['0', '3'],
        ])],
        // If at State 3
        ['3', new Map([
            // Input 0 → State 3
            ['1', '3'],
        ])],
    ]),
    // Start at State 1
    '1',
    // Accept States { 1, 3 }
    new Set(['1', '3'])
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
δ         | d     | Map of String => (Map of String => Set of Strings)
q0        | s     | String
F         | f     | Set of Strings

Example:

```typescript
import { NFA } from 'path/to/nfa.ts';

// NFA describing a|b in Thompson's Construction
const nfa = new NFA(
    // Thompson's Construction for a|b
    new Set([
        '1', '2',
    // ↗         ↘
    's',         'f',
    // ↘         ↗
        '3', '4'
    ]),
    // Alphabet { a, b }
    new Set(['a', 'b']),
    // Transition Functions
    new Map([
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
    // Start at State s
    's',
    // Accept States { f }
    new Set(['f'])
)

// Tests
console.log(nfa.run('c'))  // Expect false
console.log(nfa.run('a'))  // Expect true
console.log(nfa.run('b'))  // Expect true
console.log(nfa.run('ab')) // Expect false
```

## Personal Notes

### Development

#### deno

For this project, I used TypeScript on the [deno](https://deno.land/) runtime.

And my experience with deno was great!

Especially as a person new to TypeScript, having built-in TypeScript Support was a huge benefit as I did not have to configure any confusing compilation steps or install any other dependencies.

Not only this, in tangent with Visual Studio Code's first class support for TypeScript, the process to adopt was seemless.

I primary use Node.js and have had some suspicions on the structure, following the same ideas as [Ryan Dahl's concerns about Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA) (I should not be able to rewrite my whole computer without any permission checks just because of a bug).

I also had some concerns that deno would be slower than Node.js because of the built-in TypeScript support.

However, the command line is explicit on whether compilation occurs and the code that I wrote in this project had no speed difference.

```bash
# Outputs file that is compiled!
$ deno nfa.test.ts
Compile file:///Users/stevenyuan/Work/Current/finite-automata/nfa.test.ts
...
# No compilation if no changes are done!
$ deno nfa.test.ts
...
```

#### Testing

I wrote [two functions in test.ts](https://github.com/syall/finite-automata/blob/master/test.ts) that look similar to Jest's API that are surprisingly simple to implement.

Although I do not have the comparison functions or any complex compatibility with existing frameworks, the structure of the tests organizes the tests well with a decent output.

```bash
$ deno nfa.test.ts
NFA Tests
  ✓ Accept Empty String
  ✓ Reject Nonexistent Transition: 1
  ✓ Reject 0
  ✓ Accept 01
  ✓ Accept 011
  ✓ Accept 0110
  ✓ Accept 01101
  ✓ Accept 011111111111
  ✓ Accept 1 Non-deterministic Path
```

#### Null Transitions

For the NFA Class, one of the challenges I had to tackle was the implementation of null transitions.

Before every transition, the set of possible states that an input could be must include any states that can be reached with a null transition, and any states that can be reached with a null transition from those states..., etc.

I realized that this would require state traversal of the finite automaton, so I decided to implement a depth-first search to reach all of the possible states.

However, even after a successful implementation of DFS, some test cases still failed although I expected it to pass!

It turns out that on the last iteration, I did not take the null transitions for that final set of states into account.

This brought up the question: When should the null transitions be calculated?

Here is the structure of the considerations of a minimal combination to calculate null transitions:

```text
Run
1 >
Start Iteration
    2 >
    Transition
    3 >
End Iteration
4 >
End Run
```

One Combination that works is 1 and 3, calculating the null transitions before the first Iteration (1) so the transitions are calculated before the first Transition as well as recalculating null transitions before the next Iteration (3).

Another Combination is 2 and 4, calculating the null transitions just before the first Transition (2) in the first Iteration, but required to find the null transitions before returning the final values (4) as the last Iteration does not calculate the null transitions.

In this case, I arbitrarily chose the second combination, although the first combination seems semantically more sensible since the start states in the second combination do not reflect the actual start states with null transitions, but with the user defined one.

### Reflection

The theory that a machine with such simple rules for construction can perform complex computations is remarkable.

Not only this, there are aspects that strikes a resemblance to functional programming, especially using Thompson's Constructions to use premade automata as building blocks.

Even more, adding in nondeterminism adds in concepts similar to logical programming, particularly the Prolog Language evaluation.

Althogh the implementation here is not very useful as it only deals with a specific class of automata (string by character), the framework could be used as a basis for an even higher level abstraction.

For Spring Semester 2020, I am enrolled in Formal Languages and Automata (01:198:452) at Rutgers University where I thought the main focus would be on Formal Languages and Automata but, to my surprise, most of it are focused on Complexity Analysis.

However, this does not mean the topic is not delved into.

At only 4 weeks in, I could not understand most of the topics covered in the proofs, leading to my frustration in just implementing the finite automata.

If you want a taste of what I am studying, try reading some excerpts from [Michael Sipser's Introduction to the Theory of Computation](http://math.mit.edu/~sipser/book.html).

[syall](https://github.com/syall)
