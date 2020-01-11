declare module 'catchify' {
  declare function catchify(a: Promise<T>): Promise<[any, any]>;
  export default catchify;
}
