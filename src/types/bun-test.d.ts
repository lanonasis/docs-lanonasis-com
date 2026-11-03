// Minimal ambient declarations for the slice of `bun:test` this repo uses.
//
// The repo typechecks with `tsc` against `"types": ["node"]` and does not
// depend on bun-types, so without this the playground regression test cannot
// be typechecked. The test is executed with `bun test`, not `tsc`.
declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function test(
    name: string,
    fn: () => void | Promise<void>,
  ): void;
  export function expect(actual: unknown): any;
}
