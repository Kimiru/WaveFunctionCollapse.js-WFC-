export type blockposition = [number, number, number];
export type cellbuilder<T> = (position: blockposition) => T;
export declare class Block<T> {
    #private;
    get width(): number;
    get height(): number;
    get depth(): number;
    cellBuilder: cellbuilder<T>;
    constructor(args: {
        width?: number;
        height?: number;
        depth?: number;
        cellBuilder: cellbuilder<T>;
    });
    get range(): [blockposition, blockposition];
    getAllCells(): [blockposition, T][];
    getCellAtPosition(position: blockposition): T | null;
    containsPosition([x, y, z]: blockposition): boolean;
    neighborOf([x, y, z]: blockposition, side: Block.Side): blockposition | null;
    static blockPositionToId(position: blockposition): string;
    static idToBlockPosition(id: string): blockposition;
}
export declare namespace Block {
    enum Side {
        LEFT = 0,
        RIGHT = 1,
        DOWN = 2,
        UP = 3,
        BACK = 4,
        FRONT = 5
    }
    function sideToDir(side: Block.Side): blockposition;
    function dirToSide(x: number, y: number, z: number): Side;
}
