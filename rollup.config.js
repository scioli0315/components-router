import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const pkg = require('./package.json')
const name = pkg.name

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} scioli0315
  * @license MIT
  */`

let hasTSChecked = false

const outputConfigs = {
  'esm-bundler': {
    file: pkg.module,
    format: `es`
  },
  cjs: {
    file: pkg.main,
    format: `cjs`
  },
  esm: {
    file: pkg.browser || pkg.module.replace('bundler', 'browser'),
    format: `es`
  }
}

const allFormats = Object.keys(outputConfigs)
const packageFormats = allFormats
const packageConfigs = packageFormats.map((format) => createConfig(format, outputConfigs[format]))

packageFormats.forEach((format) => {
  if (format === 'cjs') {
    packageConfigs.push(createProductionConfig(format))
  } else if (format === 'global') {
    packageConfigs.push(createMinifiedConfig(format))
  }
})

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.banner = banner
  output.externalLiveBindings = false
  output.globals = {
    vue: 'Vue'
  }

  const isGlobalBuild = format === 'global'
  const isRawESMBuild = format === 'esm'
  const isBundlerESMBuild = /esm-bundler/.test(format)

  if (isGlobalBuild) output.name = 'ComponentsRouter'

  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['playground', 'docs']
    }
  })

  hasTSChecked = true

  const external = ['vue', 'qs', 'history']

  const nodePlugins = [resolve(), commonjs()]

  return {
    input: `src/index.ts`,
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(
        isBundlerESMBuild,
        isGlobalBuild || isRawESMBuild || isBundlerESMBuild,
        isGlobalBuild
      ),
      ...nodePlugins,
      ...plugins
    ],
    output
  }
}

function createReplacePlugin(isBundlerESMBuild, isBrowserBuild, isGlobalBuild) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${pkg.version}"`,
    __BROWSER__: isBrowserBuild,
    __BUNDLER__: isBundlerESMBuild,
    __GLOBAL__: isGlobalBuild
  }
  Object.keys(replacements).forEach((key) => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace(replacements)
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: `lib/${name}.${format}.prod.js`,
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: `lib/${name}.${format}.prod.js`,
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      })
    ]
  )
}
