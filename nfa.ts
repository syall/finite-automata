export class NFA {

    public q: Set<string>;
    public a: Set<string>;
    public d: Map<string, Map<string, Set<string>>>;
    public s: string;
    public f: Set<string>;

    constructor(
        q: Set<string>,
        a: Set<string>,
        d: Map<string, Map<string, Set<string>>>,
        s: string,
        f: Set<string>
    ) {
        // Verification of Input
        if (!q.has(s)) {
            throw new Error(`Accept State ${s} not in ${[...q]}`);
        }
        for (const c of f) if (!q.has(c)) {
            throw new Error(`Final State ${c} not in ${[...q]}`);
        }
        for (const [start, transitions] of d) {
            if (!q.has(start)) {
                throw new Error(`Delta Start State ${start} not in ${[...q]}`);
            }
            for (const [input, next] of transitions) {
                if (input !== '' && !a.has(input)) {
                    throw new Error(`Delta Input ${input} not in ${[...a]}`);
                }
                for (const t of next) {
                    if (!q.has(t)) {
                        throw new Error(`Delta End State ${t} not in ${[...q]}`);
                    }
                }
            }
        }

        this.q = q;
        this.a = a;
        this.d = d;
        this.s = s;
        this.f = f;
    }

    public run(src: string): boolean {
        // Run Automata
        let ss = new Set([this.s]);
        for (const c of src) {
            ss = this.transitions(ss, c);
        }
        ss = this.nullTransitions(ss);
        for (const s of ss) {
            if (this.f.has(s)) {
                return true;
            }
        }
        return false;
    }

    private transitions(ss: Set<string>, c: string): Set<string> {
        // Run Transitions
        ss = this.nullTransitions(ss);
        let newSS: Set<string> = new Set();
        for (const s of ss) {
            if (!this.a.has(c)) {
                continue;
            } else if (this.d.get(s) && !this.d.get(s).get(c)) {
                continue;
            } else if (this.d.get(s)) {
                for (const n of this.d.get(s).get(c)) {
                    newSS.add(n);
                }
            }
        }
        return newSS;
    }

    private nullTransitions(ss: Set<string>): Set<string> {
        // Run Null Transitions
        const visited: Set<string> = new Set();
        let newSS: Set<string> = new Set();
        for (const s of ss) {
            newSS = new Set([...newSS, ...this.dfsNull(s, visited)]);
        }
        return new Set([...ss, ...newSS]);
    }

    private dfsNull(s: string, visited: Set<string>): Set<string> {
        // DFS for Null Transitions
        if (visited.has(s)) {
            return new Set();
        } else {
            visited.add(s);
        }
        if (this.d.get(s) && !this.d.get(s).get('')) {
            return new Set([s]);
        }
        let ret = new Set([s]);
        if (this.d.get(s)) {
            for (const f of this.d.get(s).get('')) {
                ret = new Set([...ret, ...this.dfsNull(f, visited)]);
            }
        }
        return ret;
    }

}
