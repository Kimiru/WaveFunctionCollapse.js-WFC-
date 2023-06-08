export type blockposition = [number, number, number]
export type cellbuilder<T> = (position: blockposition) => T

export class Block<T> {

    #width: number = 1
    #height: number = 1
    #depth: number = 1

    get width() { return this.#width }
    get height() { return this.#height }
    get depth() { return this.#depth }

    cellBuilder: cellbuilder<T>

    #cells: T[]
    #infiniCells: { [s: string]: T }

    constructor(args: {
        width?: number,
        height?: number,
        depth?: number,
        cellBuilder: cellbuilder<T>
    }) {

        this.cellBuilder = args.cellBuilder

        let width = args.width ?? 1
        let height = args.height ?? 1
        let depth = args.depth ?? 1

        if (width < 1 || height < 1 || depth < 1) throw 'Block dimension cannot be less than 1x1x1'

        this.#width = width
        this.#height = height
        this.#depth = depth

        this.#cells = []

        for (let index = 0; index < width * height * depth; index++) {

            this.#cells.push(this.cellBuilder(this.#indexToPosition(index)))

        }

    }

    get range(): [blockposition, blockposition] {

        let allCellsPosition = this.getAllCells().map(([position]) => position)

        return [
            [
                Math.min(...allCellsPosition.map(p => p[0])),
                Math.min(...allCellsPosition.map(p => p[1])),
                Math.min(...allCellsPosition.map(p => p[2]))
            ],
            [
                Math.max(...allCellsPosition.map(p => p[0])),
                Math.max(...allCellsPosition.map(p => p[1])),
                Math.max(...allCellsPosition.map(p => p[2]))
            ]
        ]

    }

    getAllCells(): [blockposition, T][] {

        return this.#cells.map((cell, index) => [this.#indexToPosition(index), cell])

    }

    getCellAtPosition(position: blockposition): T | null {

        if (!this.containsPosition(position)) return null
        return this.#cells[this.#positionToIndex(position)] ?? null

    }

    #positionToIndex([x, y, z]: blockposition): number {

        return x + y * this.width + z * (this.width * this.height)

    }

    #indexToPosition(index: number): blockposition {

        let x = index % this.width
        let y = Math.floor(index / this.width) % this.height
        let z = Math.floor(index / (this.width * this.height))

        return [x, y, z]

    }

    containsPosition([x, y, z]: blockposition): boolean {

        return 0 <= x && x < this.width && 0 <= y && y < this.height && 0 <= z && z < this.depth

    }

    neighborOf([x, y, z]: blockposition, side: Block.Side): blockposition | null {

        let [sx, sy, sz] = Block.sideToDir(side)

        x += sx
        y += sy
        z += sz

        if (this.containsPosition([x, y, z]))
            return [x, y, z]

        return null

    }

    static blockPositionToId(position: blockposition): string {

        return position.join('|')

    }

    static idToBlockPosition(id: string): blockposition {
        return id.split('|').map(Number) as blockposition
    }
}

export namespace Block {
    export enum Side {
        LEFT = 0,
        RIGHT = 1,
        DOWN = 2,
        UP = 3,
        BACK = 4,
        FRONT = 5
    }

    export function sideToDir(side: Block.Side): blockposition {

        let x = 0, y = 0, z = 0

        switch (side) {
            case Block.Side.LEFT:
                x--
                break
            case Block.Side.RIGHT:
                x++
                break
            case Block.Side.DOWN:
                y--
                break
            case Block.Side.UP:
                y++
                break
            case Block.Side.BACK:
                z--
                break
            case Block.Side.FRONT:
                z++
                break

            default:
                y++
        }

        return [x, y, z]

    }

    export function dirToSide(x: number, y: number, z: number): Side {

        if (x < 0) return Side.LEFT
        if (x > 0) return Side.RIGHT
        if (y < 0) return Side.DOWN
        if (y > 0) return Side.UP
        if (z < 0) return Side.BACK
        if (z > 0) return Side.FRONT

        return Side.UP

    }
}