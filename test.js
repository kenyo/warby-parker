const assert = require(`assert`)
const wp = require(`./index`)

describe(`warby parker`, function() {

  describe(`#matchPattern`, function() {
    it(`should match given patterns`, () => {
      const testResult = wp.matchPattern(
        // patterns
        [`x,y`, `A,*,B,*,C`],
        // paths
        [`x/y`, `A/foo/B/bar/C`]
      )
      assert.deepEqual(testResult, [`x,y`, `A,*,B,*,C`]);
    })

    it(`should match patterns provided in prompt`, () => {
      const testResult = wp.matchPattern(
        [`*,b,*`, `a,*,*`, `*,*,c`, `foo,bar,baz`, `w,x,*,*`, `*,x,y,z`],
        [`w/x/y/z`, `a/b/c`, `foo`, `foo/bar`, `foo/bar/baz`]
      )
      assert.deepEqual(
        testResult, ['*,x,y,z', 'a,*,*', 'NO MATCH', 'NO MATCH', 'foo,bar,baz'])
    })
  })

  describe(`#findBestPattern`, function() {
    it(`should find best pattern according to rules`, () => {
      const testResult = wp.findBestPattern(
        [`x,*`, `x,y`, `A,*,B,*,C`],
        `x/y`
      )
      assert.equal(testResult, `x,y`)
    })
  })

  describe(`#evaluatePatterns`, function() {
    it(`should count wildcards correctly`, () => {
      const testResult = wp.evaluatePattern([`*`, `*`, `*`, `*`, `*`])
      assert.equal(testResult, 5005)
    })

    it(`should not count score for exact path match`, () => {
      const testResult = wp.evaluatePattern([`a`, `b`, `c`])
      assert.equal(0, testResult)
    })

    it(`should score wildcards and matches correctly`, () =>{
      const testResult = wp.evaluatePattern([`a`, `*`, `c`, `*`])
      assert.equal(2003, testResult)
    })
  })

  describe(`#tiebreaker`, function() {
    it(`should break ties`, () => {
      const testResult = wp.tiebreaker([
        [`A`, `*`, `C`, `*`, `E`],
        [`A`, `*`, `C`, `D`, `*`],
        [`A`, `*`, `C`, `D`, `E`, `*`],
      ])
      assert.deepEqual([`A`, `*`, `C`, `D`, `E`, `*`], testResult)
    })
  })

})
