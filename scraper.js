import {
    existsSync,
    mkdirSync,
    writeFile,
    closeSync,
    openSync
} from 'fs'
import cheerio from 'cheerio'
import request from 'sync-request'
import chalk from 'chalk'

// If this stops working at any time, run the following in the browser after
// inspecting element on the page and selecting the first <tbody> so it's assigned to $0
//
// function mapper (el) {
//   let code = $('.code a', el)
//   if (code === null) { return null }
//
//   let emoji = $('.chars', el)
//   let name = $('.name', el)
//   let name_keywords = $$('[target=annotate]', el)
//   let keywords = [].map.call(name_keywords, (element) => {
//     return element.innerText
//   })
//   return {
//     'code': code.innerText,
//     'emoji': emoji.innerText,
//     'name': name.innerText,
//     'keywords': keywords,
//   }
// }

// let data = [].map.call($$('tr', $0), mapper).filter((elem) => { return elem !== null })

// copy(JSON.stringify(data))

// ----------

const UNICODE_FILE = 'dist/unicode.json'
const UNICODE_URL = 'http://unicode.org/emoji/charts/full-emoji-list.html'

// 'touch' the file first so it exists when writing to it
if(!existsSync('dist')) {
  mkdirSync('dist')
}
closeSync(openSync(UNICODE_FILE, 'w'))

console.log(chalk.green('Scraping unicode.org, this might take awhile...  '))

let response = request('GET', UNICODE_URL)
let responseData = response.getBody('utf8')

let $ = cheerio.load(responseData)
let $tableRows = $('body table:first-of-type tr')
let data = []

$tableRows.map((_, el) => {
  let $tableRow = $(el)
  let $code = $tableRow.find('.code a')
  let $emoji = $tableRow.find('.chars')
  let $name = $tableRow.find('.name').first()

  // The `keywords` field uses the same .name selector, so we target with
  // attribute selectors here
  let $nameKeywords = $tableRow.find('[target=annotate]')

  let keywords = []
  $nameKeywords.map((_, el) => {
    let $keywordAnchor = $(el)
    if ($keywordAnchor !== null) {
      keywords.push($keywordAnchor.text())
    }
  })

  data.push({
    'code': $code.text(),
    'emoji': $emoji.text(),
    'name': $name.text(),
    'keywords': keywords
  })
})

// Some of the data might contain blank rows so filter them out here
let jsonData = JSON.stringify(data.filter((char) => {
  return char.code !== ''
}))

writeFile(UNICODE_FILE, jsonData, 'UTF-8', () => {
  console.log(chalk.green('==> ✅  Successfully scraped unicode.org'))
})
