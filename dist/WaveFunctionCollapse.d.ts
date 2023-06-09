import { Block, blockposition } from "./Block.js";
export declare class WaveFunctionCollapse {
    #private;
    connectors: {
        [n: number]: WFC.Connector[];
    };
    connectorsLookupTable: {
        [n: number]: [number[], number[], number[], number[], number[], number[]];
    };
    addConnector(rule: WFC.Rule): void;
    buildLookupTable(): void;
    getAvailableOptions(): number[];
    createSolution(args: {
        width?: number;
        height?: number;
        depth?: number;
        infinite?: boolean;
    }): WFC.Solution;
    collapse(solution: WFC.Solution, position: blockposition, idToUse?: number): void;
    fullCollapse(solution: WFC.Solution, start?: {
        position: blockposition;
        idToUse?: number;
    }): void;
    propagate(solution: WFC.Solution, position: blockposition): void;
}
export declare namespace WFC {
    type Connection = number[];
    function mirrorConnection(connection: Connection): Connection;
    function areConnectionMatching(connectionA: Connection, connectionB: Connection): boolean;
    interface Connector {
        side: Block.Side;
        connection: Connection;
    }
    function areConnectionsCompatible(connectionA: Connector, connectionB: Connector): boolean;
    interface Rule {
        id: number;
        connectors: Connector[];
    }
    /**
    * Rotate the rule steps times in the trigonometric direction on the given axis
    */
    function rotateRule(rule: Rule, side: Block.Side, steps?: number, newid?: number): Rule;
    interface Cell {
        options: number[];
        solved: boolean;
    }
    class Solution extends Block<Cell> {
        wfc: WaveFunctionCollapse;
        constructor(args: {
            width?: number;
            height?: number;
            depth?: number;
            infinite?: boolean;
        }, wfc: WaveFunctionCollapse);
        solved(): boolean;
        clearCellsAtPositions(positions: [number, number, number][]): void;
    }
}
