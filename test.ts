#!/usr/local/bin/deno

// @ts-ignore
import { DFA, NFA } from './dfa.ts';

const dfa = new DFA(
    new Set(['a', 'b', 'c']),
    new Set(['0', '1']),
    new Map([
        ['a', new Map([['0', 'a'], ['1', 'b']])],
        ['b', new Map([['0', 'b'], ['1', 'c']])],
        ['c', new Map([['0', 'c'], ['1', 'a']])]
    ]),
    'a',
    new Set(['c'])
);
console.group('DFA Test Start');
console.log(dfa.run('0111111'));
console.groupEnd();
console.log('DFA Test End');

const nfa = new NFA(
    new Set(['a', 'b', 'c', 'd']),
    new Set(['0', '1']),
    new Map([
        ['a', new Map([['0', new Set(['b'])]])],
        ['b', new Map([['1', new Set(['c'])]])],
        ['c', new Map([['1', new Set(['c'])], ['', new Set(['d'])]])],
        ['d', new Map()]
    ]),
    'a',
    new Set(['d'])
);
console.group('NFA Test Start');
console.log(nfa.run('02111111'));
console.groupEnd();
console.log('NFA Test End');
