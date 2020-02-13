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
            else if (!this.d.get(s).get(c))
                return false;
            else s = this.d.get(s).get(c);
        return this.f.has(s);
    }

}

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
        if (!q.has(s))
            throw new Error(`Accept State ${s} not in ${[...q]}`);
        for (const c of f) if (!q.has(c))
            throw new Error(`Final State ${c} not in ${[...q]}`);
        for (const [ok, ov] of d)
            if (!q.has(ok))
                throw new Error(`Delta Start State ${ok} not in ${[...q]}`);
            else for (const [k, v] of ov)
                if (k !== '' && !a.has(k))
                    throw new Error(`Delta Input ${k} not in ${[...a]}`);
                else for (const t of v) if (!q.has(t))
                    throw new Error(`Delta End State ${t} not in ${[...q]}`);

        this.q = q;
        this.a = a;
        this.d = d;
        this.s = s;
        this.f = f;
    }

    public run(src: string): boolean {
        let ss = new Set([this.s]);
        for (const c of src)
            ss = this.transitions(ss, c);
        ss = this.nullTransitions(ss);
        for (const s of ss) if (this.f.has(s))
            return true;
        return false;
    }

    private nullTransitions(ss: Set<string>): Set<string> {
        const visited: Set<string> = new Set();
        let newSS: Set<string> = new Set();
        for (const s of ss)
            newSS = this.dfsNull(s, visited);
        newSS = new Set([...ss, ...newSS]);
        return newSS;
    }

    private dfsNull(s: string, visited: Set<string>): Set<string> {
        if (visited.has(s))
            return new Set();
        else visited.add(s);
        if (!this.d.get(s).get(''))
            return new Set([s]);
        let ret = new Set([s]);
        for (const f of this.d.get(s).get(''))
            ret = new Set([...ret, ...this.dfsNull(f, visited)]);
        return ret;
    }

    private transitions(ss: Set<string>, c: string): Set<string> {
        ss = this.nullTransitions(ss);
        let newSS: Set<string> = new Set();
        for (const s of ss)
            if (!this.a.has(c)) continue;
            else if (!this.d.get(s).get(c)) continue;
            else for (const n of this.d.get(s).get(c))
                newSS.add(n);
        return newSS;
    }

}
