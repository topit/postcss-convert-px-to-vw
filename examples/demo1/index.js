const postcss = require('postcss')
const pxToRemVw = require('../../')
const fs = require('fs')

const opts = {
  baseSize: {
    rem: 750,
    vw: 7.5
  },
  precision: 6,
  forceRemProps: [ 'font', 'font-size' ],
  keepRuleComment: 'no',
  keepFileComment: 'pxconverter-disable',
  toVw: true,
  toRem: true
}

fs.readFile('./input.css', (err, css) => {
  postcss([pxToRemVw(opts)])
    .process(css, { from: './input.css', to: './output.css' })
    .then(result => {
      fs.writeFileSync('./output.css', result.css)
      if ( result.map ) fs.writeFile('./output.css.map', result.map)
    })
    .catch(err => {
      console.error(err)
    })
})

