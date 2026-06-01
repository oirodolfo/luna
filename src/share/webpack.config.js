const path = require('path')
const { presetMini } = require('unocss')
const { createGenerator } = require('@unocss/core')
const prefixer = require('postcss-prefixer')
const autoprefixer = require('autoprefixer')
const clean = require('postcss-clean')
const camelCase = require('./native/compat/camelCase')
const upperFirst = require('./native/compat/upperFirst')
const each = require('./native/compat/each')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const uno = createGenerator({
  presets: [presetMini()],
})

module.exports = function (
  name,
  { useIcon = false, hasStyle = true, dependencies = [], analyzer = false } = {}
) {
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [
        require('@unocss/postcss')({
          uno,
        }),
        prefixer({
          prefix: `luna-${name}-`,
          ignore: [`luna-`],
        }),
        autoprefixer,
        clean(),
      ],
    },
  }

  const entry = [`./src/${name}/index.ts`]
  if (hasStyle) {
    entry.unshift(`./src/${name}/style.css`)
  }
  if (useIcon) {
    entry.unshift(`./src/${name}/icon.css`)
  }

  const externals = {}
  each(dependencies, (dependency) => {
    const pkgName = 'luna-' + dependency
    externals[pkgName] = {
      root: 'Luna' + upperFirst(camelCase(dependency)),
      commonjs: pkgName,
      commonjs2: pkgName,
      amd: pkgName,
    }
  })

  return function (env, options) {
    const plugins = [
      new MiniCssExtractPlugin({
        filename: `luna-${name}.css`,
      }),
    ]

    if (analyzer) {
      plugins.push(new BundleAnalyzerPlugin())
    }

    return {
      mode: options.mode,
      entry,
      devtool: 'source-map',
      output: {
        filename: `luna-${name}.js`,
        path: path.resolve(__dirname, `../../dist/${name}`),
        publicPath: '/assets/',
        library: `Luna${upperFirst(camelCase(name))}`,
        libraryTarget: 'umd',
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      plugins,
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
          },
          {
            test: /\.css/,
            loaders: [MiniCssExtractPlugin.loader, 'css-loader', postcssLoader],
          },
        ],
      },
      externals,
    }
  }
}
