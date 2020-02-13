#!/usr/local/bin/deno

// @ts-ignore
import { DFA, NFA } from './dfa.ts';
// @ts-ignore
import { test, testGroup } from './test.ts';

testGroup('DFA Tests', () => {
    const dfa = new DFA(
        new Set(['a', 'b', 'c']),
        new Set(['0', '1']),
        new Map([
            ['a', new Map([
                ['0', 'a'],
                ['1', 'b']
            ])],
            ['b', new Map([
                ['0', 'b'],
                ['1', 'c']
            ])],
            ['c', new Map([
                ['0', 'c'],
                ['1', 'a']
            ])]
        ]),
        'a',
        new Set(['c'])
    );
    test('Reject Empty String', () => !dfa.run(''));
    test('Reject Foreign Alphabet: 2', () => !dfa.run('2'));
    test('Reject 000', () => !dfa.run('000'));
    test('Reject 100', () => !dfa.run('100'));
    test('Accept 110', () => dfa.run('110'));
    test('Reject 111', () => !dfa.run('111'));
    test('Accept 0101001001001', () => dfa.run('0101001001001'));
});

testGroup('NFA Tests', () => {
    const nfa = new NFA(
        new Set(['a', 'b', 'c', 'd']),
        new Set(['0', '1']),
        new Map([
            ['a', new Map([
                ['0', new Set(['b'])]
            ])],
            ['b', new Map([
                ['1', new Set(['c'])]
            ])],
            ['c', new Map([
                ['1', new Set(['c'])],
                ['', new Set(['d'])]
            ])],
            ['d', new Map([
                ['0', new Set(['a', 'b'])]
            ])]
        ]),
        'a',
        new Set(['a', 'd'])
    );
    test('Accept Empty String', () => nfa.run(''));
    test('Reject Nonexistent Transition: 1', () => !nfa.run('1'));
    test('Reject 0', () => !nfa.run('0'));
    test('Accept 01', () => nfa.run('01'));
    test('Accept 011', () => nfa.run('011'));
    test('Accept 0110', () => nfa.run('0110'));
    test('Accept 01101', () => nfa.run('01101'));
    test('Accept 011111111111', () => nfa.run('011111111111'));
    const paths = new NFA(
        new Set(['a', 'b', 'c', 'd', 'e', 'f']),
        new Set(['0']),
        new Map([
            ['a', new Map([
                ['0', new Set(['b', 'c', 'd', 'e', 'f'])]
            ])]
        ]),
        'a',
        new Set(['f'])
    );
    test('Accept 1 Non-deterministic Path', () => paths.run('0'));
});
