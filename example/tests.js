import { describe } from 'mocha'
import { Block } from '../dist/Block.js'
import { WaveFunctionCollapse } from '../dist/WaveFunctionCollapse.js'
import should from 'should'

describe('Finite block test', () => {

    let block

    before(() => {
        block = new Block({ width: 3, height: 3, depth: 3, cellBuilder: ([x, y, z]) => x + y + z })
    })

    it('Should have cell at position 0 0 0', () => {

        let cell = block.getCellAtPosition([0, 0, 0])

        cell.should.be.equal(0)

    })

    it('Should have cell at position 2 2 2', () => {

        let cell = block.getCellAtPosition([2, 2, 2])

        cell.should.be.equal(6)

    })

    it('Should have cell at position -1 -1 -1', () => {

        let cell = block.getCellAtPosition([-1, -1, -1])

        should(cell).not.be.ok()

    })

    it('Should have cell at position 3 3 3', () => {

        let cell = block.getCellAtPosition([3, 3, 3])

        should(cell).not.be.ok()

    })

})

describe('WaveFunctionCollapse', () => {

    let wfc = new WaveFunctionCollapse()

    wfc.addConnector({
        id: 0, connectors: [
            { side: Block.Side.UP, connection: [0, 1] },
            { side: Block.Side.RIGHT, connection: [0, 1] },
            { side: Block.Side.DOWN, connection: [0, 1] },
            { side: Block.Side.LEFT, connection: [0, 1] }
        ]
    })

    wfc.addConnector({
        id: 4, connectors: [
            { side: Block.Side.UP, connection: [0, 1] },
            { side: Block.Side.RIGHT, connection: [0, 1] },
            { side: Block.Side.DOWN, connection: [0, 1] },
            { side: Block.Side.LEFT, connection: [0, 1] }
        ]
    })

    wfc.addConnector({
        id: 1, connectors: [
            { side: Block.Side.UP, connection: [1, 0] },
            { side: Block.Side.RIGHT, connection: [1, 0] },
            { side: Block.Side.DOWN, connection: [1, 0] },
            { side: Block.Side.LEFT, connection: [1, 0] }
        ]
    })
    wfc.addConnector({
        id: 2, connectors: [
            { side: Block.Side.UP, connection: [1, 0] },
            { side: Block.Side.RIGHT, connection: [1, 0] },
            { side: Block.Side.DOWN, connection: [1, 0] },
            { side: Block.Side.LEFT, connection: [1, 0] }
        ]
    })

    wfc.buildLookupTable()

    it('Should have a lookup table with two entry', () => {

        let entries = Object.entries(wfc.connectorsLookupTable)

        entries.length.should.be.equal(4)

    })

    it('Should collapse 2 by 2 properly', () => {

        let solution = wfc.createSolution({ width: 2, height: 2 })

        wfc.fullCollapse(solution, {
            position: [0, 0],
            idToUse: 0
        })

        solution.getCellAtPosition([0, 0, 0]).solved.should.be.equal(true)
        solution.getCellAtPosition([1, 0, 0]).solved.should.be.equal(true)
        solution.getCellAtPosition([0, 1, 0]).solved.should.be.equal(true)
        solution.getCellAtPosition([1, 1, 0]).solved.should.be.equal(true)

        solution.getCellAtPosition([0, 0, 0]).options.length.should.be.equal(1)
        solution.getCellAtPosition([1, 0, 0]).options.length.should.be.equal(1)
        solution.getCellAtPosition([0, 1, 0]).options.length.should.be.equal(1)
        solution.getCellAtPosition([1, 1, 0]).options.length.should.be.equal(1)

    })

})