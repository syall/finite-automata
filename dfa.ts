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
        if (!q.has(s))
            throw new Error(`Accept State ${s} not in ${[...q]}`);
        for (const c of f) if (!q.has(c))
            throw new Error(`Final State ${c} not in ${[...q]}`);
        for (const [ok, ov] of d)
            if (!q.has(ok))
                throw new Error(`Delta Start State ${ok} not in ${[...q]}`);
            else for (const [k, v] of ov)
                if (!a.has(k))
                    throw new Error(`Delta Input ${k} not in ${[...a]}`);
                else if (!q.has(v))
                    throw new Error(`Delta End State ${v} not in ${[...q]}`);

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
            else if (this.d.get(s) && !this.d.get(s).get(c))
                return false;
            else if (this.d.get(s)) s = this.d.get(s).get(c);
        return this.f.has(s);
    }

}
