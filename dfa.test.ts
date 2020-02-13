// @ts-ignore
import { DFA } from './dfa.ts';
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
