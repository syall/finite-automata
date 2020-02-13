// @ts-ignore
import { NFA } from './nfa.ts';
// @ts-ignore
import { test, testGroup } from './test.ts';

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
