function isVirtualStylesheet(file) {
  return !file || file.includes('\0') || file.includes('html-proxy');
}

/** @type {import('postcss-load-config').ConfigFn} */
export default (ctx) => {
  if (isVirtualStylesheet(ctx.file)) {
    return { plugins: {} };
  }

  return {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  };
};
