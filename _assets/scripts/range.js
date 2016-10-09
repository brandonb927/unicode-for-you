// Create a generator function returning an
// iterator to a specified range of numbers
// http://davidarvelo.com/blog/array-number-range-sequences-in-javascript-es6/
const range = (start, end) => {
  return Array.from({
    length: ((end - start) + 1)},
    (v, k) => k + start
  )
}

export default range
