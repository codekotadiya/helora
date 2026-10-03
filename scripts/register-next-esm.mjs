const NEXT_SPECIFIERS = new Set([
  "next/server",
  "next/experimental/testing/server",
]);

export async function resolve(specifier, context, nextResolve) {
  if (NEXT_SPECIFIERS.has(specifier)) {
    return nextResolve(`${specifier}.js`, context);
  }
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.[mc]?[jt]s$/.test(specifier)
  ) {
    return nextResolve(`${specifier}.ts`, context);
  }
  return nextResolve(specifier, context);
}
