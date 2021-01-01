const build = (process) => {
  const config = {
    pages: {
      index: {
        entry: `playground/main.ts`,
        template: `public/index.html`,
        filename: 'index.html'
      }
    },
    publicPath: '',
    outputDir: `dist/`
  }

  return {
    config
  }
}

module.exports = build
