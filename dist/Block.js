export class Block {
    #width = 1;
    #height = 1;
    #depth = 1;
    get width() { return this.#width; }
    get height() { return this.#height; }
    get depth() { return this.#depth; }
    cellBuilder;
    #cells;
    #infiniCells;
    constructor(args) {
        this.cellBuilder = args.cellBuilder;
        let width = args.width ?? 1;
        let height = args.height ?? 1;
        let depth = args.depth ?? 1;
        if (width < 1 || height < 1 || depth < 1)
            throw 'Block dimension cannot be less than 1x1x1';
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
        this.#cells = [];
        for (let index = 0; index < width * height * depth; index++) {
            this.#cells.push(this.cellBuilder(this.#indexToPosition(index)));
        }
    }
    get range() {
        let allCellsPosition = this.getAllCells().map(([position]) => position);
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
        ];
    }
    getAllCells() {
        return this.#cells.map((cell, index) => [this.#indexToPosition(index), cell]);
    }
    getCellAtPosition(position) {
        if (!this.containsPosition(position))
            return null;
        return this.#cells[this.#positionToIndex(position)] ?? null;
    }
    #positionToIndex([x, y, z]) {
        return x + y * this.width + z * (this.width * this.height);
    }
    #indexToPosition(index) {
        let x = index % this.width;
        let y = Math.floor(index / this.width) % this.height;
        let z = Math.floor(index / (this.width * this.height));
        return [x, y, z];
    }
    containsPosition([x, y, z]) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height && 0 <= z && z < this.depth;
    }
    neighborOf([x, y, z], side) {
        let [sx, sy, sz] = Block.sideToDir(side);
        x += sx;
        y += sy;
        z += sz;
        if (this.containsPosition([x, y, z]))
            return [x, y, z];
        return null;
    }
    static blockPositionToId(position) {
        return position.join('|');
    }
    static idToBlockPosition(id) {
        return id.split('|').map(Number);
    }
}
(function (Block) {
    let Side;
    (function (Side) {
        Side[Side["LEFT"] = 0] = "LEFT";
        Side[Side["RIGHT"] = 1] = "RIGHT";
        Side[Side["DOWN"] = 2] = "DOWN";
        Side[Side["UP"] = 3] = "UP";
        Side[Side["BACK"] = 4] = "BACK";
        Side[Side["FRONT"] = 5] = "FRONT";
    })(Side = Block.Side || (Block.Side = {}));
    function sideToDir(side) {
        let x = 0, y = 0, z = 0;
        switch (side) {
            case Block.Side.LEFT:
                x--;
                break;
            case Block.Side.RIGHT:
                x++;
                break;
            case Block.Side.DOWN:
                y--;
                break;
            case Block.Side.UP:
                y++;
                break;
            case Block.Side.BACK:
                z--;
                break;
            case Block.Side.FRONT:
                z++;
                break;
            default:
                y++;
        }
        return [x, y, z];
    }
    Block.sideToDir = sideToDir;
    function dirToSide(x, y, z) {
        if (x < 0)
            return Side.LEFT;
        if (x > 0)
            return Side.RIGHT;
        if (y < 0)
            return Side.DOWN;
        if (y > 0)
            return Side.UP;
        if (z < 0)
            return Side.BACK;
        if (z > 0)
            return Side.FRONT;
        return Side.UP;
    }
    Block.dirToSide = dirToSide;
})(Block || (Block = {}));
