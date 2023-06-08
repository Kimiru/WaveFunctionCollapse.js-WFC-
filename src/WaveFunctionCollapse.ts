import { Block, blockposition, cellbuilder } from "./Block.js"

export class WaveFunctionCollapse {

    connectors: { [n: number]: WFC.Connector[] } = {}

    connectorsLookupTable: { [n: number]: [number[], number[], number[], number[], number[], number[]] } = {}
    #built: boolean = false

    addConnector(rule: WFC.Rule): void {

        if (!this.connectors[rule.id])
            this.connectors[rule.id] = []

        this.connectors[rule.id].push(...rule.connectors)

    }

    buildLookupTable(): void {

        this.connectorsLookupTable = {}
        this.#built = true

        for (let [id, connectorList] of Object.entries(this.connectors)) {
            let lookup: [Set<number>, Set<number>, Set<number>, Set<number>, Set<number>, Set<number>] = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set()]
            for (let connector of connectorList)
                for (let [nextid, nextconnectorList] of Object.entries(this.connectors)) for (let nextconnector of nextconnectorList)
                    if (WFC.areConnectionsCompatible(connector, nextconnector))
                        lookup[connector.side].add(Number(nextid))
            this.connectorsLookupTable[id] = lookup.map(e => [...e].sort((a, b) => a - b)) as [number[], number[], number[], number[], number[], number[]]

        }

    }

    getAvailableOptions(): number[] {

        return [...Object.entries(this.connectors)].map(([id]) => Number(id))

    }

    createSolution(args: { width?: number, height?: number, depth?: number, infinite?: boolean }): WFC.Solution {

        return new WFC.Solution(args, this)

    }

    collapse(solution: WFC.Solution, position: blockposition, idToUse?: number) {

        let cell = solution.getCellAtPosition(position)

        if (!cell) return

        if (idToUse !== undefined)
            cell.options = [idToUse]
        else
            cell.options = [cell.options[Math.floor(Math.random() * cell.options.length)]]

        cell.solved = true

        this.propagate(solution, position)

    }

    fullCollapse(solution: WFC.Solution, start?: { position: blockposition, idToUse?: number }) {

        if (start)
            this.collapse(solution, start.position, start.idToUse)

        while (!solution.solved()) {

            let allCells = solution.getAllCells()

            let [position, cell] = allCells.filter(([_, cell]) => !cell.solved).sort(([_0, a], [_1, b]) => a.options.length - b.options.length)[0]

            this.collapse(solution, position)

        }
    }

    propagate(solution: WFC.Solution, position: blockposition) {

        // insert first point into open queue
        let open: blockposition[] = [position]

        do {

            // Sort open points per available options in ascending order
            open.sort((a, b) => {
                let cellA = solution.getCellAtPosition(a)!
                let cellB = solution.getCellAtPosition(b)!

                return cellA.options.length - cellB.options.length
            })

            // Find the list of points which have the same smallest amount of options left
            let ties = open.filter((cellPosition) => solution.getCellAtPosition(cellPosition)!.options.length === solution.getCellAtPosition(open[0])!.options.length)

            // Pick one
            let chosenOne = ties[Math.floor(Math.random() * ties.length)]
            open.splice(open.indexOf(chosenOne), 1)

            // Find cell
            let cell = solution.getCellAtPosition(chosenOne)!

            // For each side
            for (let side of [Block.Side.LEFT, Block.Side.RIGHT, Block.Side.DOWN, Block.Side.UP, Block.Side.BACK, Block.Side.FRONT]) {

                let neighborPosition = solution.neighborOf(chosenOne, side)

                if (!neighborPosition) continue


                let neighbor = solution.getCellAtPosition(neighborPosition)

                // If maybe neighbor is outside the solution range, skip this side
                if (!neighbor) continue
                if (neighbor.solved) continue

                let startLength = neighbor.options.length

                let nextOptions: number[] = []

                for (let option of cell.options) {

                    let lookup = this.connectorsLookupTable[option][side]

                    for (let neighborOption of neighbor.options) {
                        if (lookup.includes(neighborOption))
                            nextOptions.push(neighborOption)

                    }

                }

                neighbor.options = [...new Set(nextOptions)]

                let endLength = neighbor.options.length

                if (endLength <= 1)
                    neighbor.solved = true

                if (startLength !== endLength) open.push(neighborPosition)

            }

        } while (open.length)

    }

}

export namespace WFC {

    export type Connection = number[]

    export function mirrorConnection(connection: Connection): Connection {

        return [...connection].reverse()

    }

    export function areConnectionMatching(connectionA: Connection, connectionB: Connection): boolean {

        if (connectionA.length !== connectionB.length) return false

        for (let indexA = 0; indexA < connectionA.length; indexA++)
            if (connectionA[indexA] !== connectionB[connectionA.length - 1 - indexA]) return false

        return true

    }

    export interface Connector {
        side: Block.Side,
        connection: Connection
    }

    export function areConnectionsCompatible(connectionA: Connector, connectionB: Connector): boolean {

        if (Math.floor(connectionA.side / 2) * 2 !== Math.floor(connectionB.side / 2) * 2) return false

        if (connectionA.side !== connectionB.side + 1 &&
            connectionA.side + 1 !== connectionB.side) return false

        return areConnectionMatching(connectionA.connection, connectionB.connection)

    }

    export interface Rule {
        id: number,
        connectors: Connector[],
    }

    export interface Cell {
        options: number[]
        solved: boolean
    }

    export class Solution extends Block<Cell> {

        wfc: WaveFunctionCollapse

        constructor(args: { width?: number, height?: number, depth?: number, infinite?: boolean }, wfc: WaveFunctionCollapse) {

            let options = wfc.getAvailableOptions()

            super({
                ...args,
                cellBuilder: () => ({ options: [...options], solved: false })
            })

            this.wfc = wfc

        }

        solved() {

            return this.getAllCells().every(([position, cell]) => cell.solved)

        }

        clearCellsAtPositions(positions: [number, number, number][]) {

            let options = this.wfc.getAvailableOptions()
            for (let position of positions) {
                let cell = this.getCellAtPosition(position)
                if (cell) {
                    cell.solved = false
                    cell.options = [...options]
                }
            }

            for (let [position, cell] of this.getAllCells()) if (cell.solved)
                this.wfc.propagate(this, position)

        }

    }

}
