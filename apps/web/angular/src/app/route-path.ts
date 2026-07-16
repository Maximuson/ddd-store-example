/** Strip leading slash for Angular route `path` segments and `createUrlTree` commands. */
export function routePath(path: string): string {
  return path.replace(/^\//, '');
}
