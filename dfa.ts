export class DFA {

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
                if (!a.has(input)) {
                    throw new Error(`Delta Input ${input} not in ${[...a]}`);
                } else if (!q.has(next)) {
                    throw new Error(`Delta End State ${next} not in ${[...q]}`);
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
        // Run Transitions
        let s = this.s;
        for (const c of src) {
            if (!this.a.has(c)) {
                return false;
            } else if (this.d.get(s) && !this.d.get(s).get(c)) {
                return false;
            } else if (this.d.get(s)) {
                s = this.d.get(s).get(c);
            }
        }
        return this.f.has(s);
    }

}
