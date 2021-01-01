const dev = () => {
  const config = {
    pages: {
      index: {
        entry: `playground/main.ts`,
        template: `public/index.html`,
        filename: 'index.html'
      }
    },
    outputDir: `dist/`
  }

  return {
    config
  }
}

module.exports = dev