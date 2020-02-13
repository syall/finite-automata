export const test = (msg: string, f: Function) => console.log(f() ? '✓' : '✗', msg);
export const testGroup = (msg: string, f: Function) => {
    console.group(msg);
    f();
    console.groupEnd();
};
