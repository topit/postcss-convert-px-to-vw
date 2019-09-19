import postcss from 'postcss'
import Converter from './Converter'

const plugin = postcss.plugin('postcss-px-to-remvw', options => {
  return (css, result) => {
    if (options.exclude) {
      if (Object.prototype.toString.call(options.exclude) !== '[object RegExp]') {
        throw new Error('options.exclude should be RegExp!')
      }
      if (css.source.input.file.match(options.exclude) !== null) {
        result.root = css
        return
      }
    }
    const converter = new Converter(options)
    const targetCssText = converter.convert(css.toString())
    result.root = postcss.parse(targetCssText)
  }
})

export default plugin
