import postcss from 'postcss'
import px2rem from '../../lib/postcss-convert-px-to-vw.js'

const demoCss = `.a { margin: 16px; }`

postcss([px2rem()])
  .process(demoCss, { from: undefined, to: undefined })
  .then(result => console.log(result.content))