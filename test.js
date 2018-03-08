const assert = require('assert')
const wp = require('./index')

describe('warby parker', function() {

  describe('#matchPattern', function() {
    it('should match given patterns', () => {
      const testResult = wp.matchPattern(
        // patterns
        [`x,y`, `A,*,B,*,C`],
        // paths
        [`x/y`, `A/foo/B/bar/C`]
      )
      assert.deepEqual([`x,y`, `A,*,B,*,C`], testResult);
    })
  })

  describe('#findBestPattern', function() {
    it('should find best pattern according to rules', () => {
      const testResult = wp.findBestPattern(
        [`x,*`, `x,y`, `A,*,B,*,C`],
        `x/y`
      )
      assert.equal('x,y', testResult)
    })
  })

  describe('#evaluatePatterns', function() {
    it('should count wildcards correctly', () => {
      const testResult = wp.evaluatePattern(['*', '*', '*', '*', '*'])
      assert.equal(5005, testResult)
    })

    it('should not count exact path match', () => {
      const testResult = wp.evaluatePattern(['a', 'b', 'c'])
      assert.equal(0, testResult)
    })

    it('should score wildcards and matches correctly', () =>{
      const testResult = wp.evaluatePattern(['a', '*', 'c', '*'])
      assert.equal(2002, testResult)
    })
  })

  describe('#tiebreaker', function() {
    it('should break ties', () => {
      const testResult = wp.tiebreaker([
        ['A', '*', 'C', '*', 'E'],
        ['A', '*', 'C', 'D', '*'],
        ['A', '*', 'C', 'D', 'E', '*'],
      ])
      assert.deepEqual(['A', '*', 'C', 'D', 'E', '*'], testResult)
    })
  })

})
