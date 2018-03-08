// with lodash
const _ = require('lodash')
const noMatch = 'NO MATCH'

function matchPattern(patterns = [], paths = []) {
  // output.length === paths.length
  return paths
    .map(path =>  findBestPattern(patterns, path))
    .map(x => (!_.isUndefined(x) && !_.isEqual(x, noMatch)) ? x.join(',') : x)
}

function findBestPattern(patterns = [], path = '') {
  const partsOfPath = path.split('/')
  const splitPatterns = patterns.map(x => x.split(','))

  // valid patterns are transformed into grades
  const matches = splitPatterns
    .map(pattern =>
      pattern.map((x, i) => {
        if (_.isEqual(x, partsOfPath[i])) return x
        else if (_.isEqual(x, '*')) return x
        else return null
      })
    )
    // any patterns including null are void
    .filter(x => !_.includes(x, null))

  if (_.isEmpty(matches)) return noMatch
  else {
    const evaluations = matches.reduce((acc, pattern, index) => {
      const patternScore = evaluatePattern(pattern)
      if (patternScore < acc[0].patternScore) {
        acc = [({patternScore, pattern})]
      } else if (patternScore === acc[0].patternScore) {
        // tie
        acc.push({patternScore, pattern})
      }
      return acc
    }, [{patternScore: Number.MAX_VALUE}])

    return tiebreaker(evaluations.map(x => x.pattern))
  }
}

function evaluatePattern(pattern) {
  // evaluate list of patterns based on 'best' criteria listed below by priority
  // (1) fewest wildcards
  const wildcardCost = 1000
  const wildcardCount = pattern.reduce((acc, curr) =>
    _.isEqual(curr, '*') ? acc += 1 : acc
  , 0) * wildcardCost

  // (2) leftmost wildcard appears furthest to the right
  const firstWildcardIndex = pattern.findIndex(x => _.isEqual(x, '*'))
  const leftmostCount = firstWildcardIndex !== -1
    ? pattern.length - firstWildcardIndex
    : 0
  // (3) if tie, prefer next wildcard appearing furthest to the right, etc.
  // (handled in tiebreaker function)
  return _.sum([wildcardCount, leftmostCount])

}

function tiebreaker(patterns, maxIndex = 0) {

  function getIndexOfNextWildcard(arr, i) {
    return _.findIndex(arr, x => _.isEqual(x, '*'), i)
  }

  while (patterns.length >= 1) {
    const wildcardMap = patterns.map(x => ({
      pattern: x,
      index: getIndexOfNextWildcard(x, maxIndex),
    }))

    const maxWildcardIndex = _.max(wildcardMap.map(x => x.index))
    const ties = wildcardMap.filter(x => x.index >= maxWildcardIndex)

    // assuming every pattern is unique...
    if (ties.length === 1) return ties[0].pattern
    else return tiebreaker(ties.map(x => x.pattern), maxWildcardIndex + 1)
  }

}

(function main() {
  process.stdin.setEncoding('utf8')

  process.stdin.on('readable', () => {
    const input = process.stdin.read()
    if (input !== null) {
      // filter out empty strings reading from stdin
      const inputList = input.split('\n').filter(x => !_.isEmpty(x))
      const pathsStartIndex = parseInt(inputList[0]) + 2
      const patterns = inputList.slice(1, pathsStartIndex - 1)
      const paths = inputList.slice(pathsStartIndex).map(x => {
        // trim leading slash
        if (_.isEqual(x[0], '/')) return x.slice(1)
        // trim trailing slash
        else if (_.isEqual(_.last(x), '/')) return x.slice(0, -1)
        else return x
      })

      const output = matchPattern(patterns, paths)
      output.forEach(x => console.log(x))
    }
  })

})()

module.exports = {
  matchPattern,
  findBestPattern,
  evaluatePattern,
  tiebreaker,
}
