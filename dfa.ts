#!/usr/local/bin/deno

/**
 * DFA: M(Q, A, D, S, F)
 */

class DFA {

    public q: Set<string>;
    public a: Set<string>;
    public d: Map<string, Map<string, string>>;
    public s: string;
    public f: Set<string>;

    constructor(
        q: Set<string>,
        a: Set<string>,
        d: Map<string, Map<string, string>>,
        s: string,
        f: Set<string>
    ) {
        if (!q.has(s))
            return null;
        for (const c of f)
            if (!q.has(c))
                return null;
        for (const [ok, ov] of d)
            if (!q.has(ok))
                return null;
            else for (const [k, v] of ov)
                if (!a.has(k) || !q.has(v))
                    return null;
        this.q = q;
        this.a = a;
        this.d = d;
        this.s = s;
        this.f = f;
    }

    public run(src: string): boolean {
        let s = this.s;
        for (const c of src)
            if (!this.a.has(c))
                return false;
            else if (!this.d.get(s).get(c))
                return false;
            else s = this.d.get(s).get(c);
        return this.f.has(s);
    }

}

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

// Tests
console.log(dfa.run('0'));
console.log(dfa.run('1'));
console.log(dfa.run('10'));
console.log(dfa.run('11'));
console.log(dfa.run('100'));
console.log(dfa.run('101'));
console.log(dfa.run('110'));
console.log(dfa.run('111'));
