export function withBase(path: string) {
  if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const cleanPath = path.replace(/^\//, "");

  return cleanPath ? `${base}${cleanPath}` : base;
}
