import axios, { type CancelTokenSource } from "axios";

export enum EDifficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export type TPlayer = "black" | "white";

export interface IPoint {
    x: number;
    y: number;
}

export interface ICalculateMoveDTO {
    mapName: string;
    timeout?: number;
    difficulty: EDifficulty;
    depth: number;
    gameState: IGameState;
}

export interface ICalculateMoveResponse {
    gameState: IGameState;
    eval: number;
}

export interface IAxtiosOptions {
    cancelToken: CancelTokenSource;
}

export interface IUnplacedPieces {
    black: number;
    white: number;
}

export interface IGameState {
    occupiedPoints: Array<ITakenPoint>;
    unplacedPieces: IUnplacedPieces;
    player: TPlayer;
}

export interface ITakenPoint {
    point: String;
    player: TPlayer;
}

export interface IMapObject {
    map_name: string;
    map_data: IMapData;
}

export interface IMapData {
    points: Array<string>;
    connections: Array<Array<string>>;
    mills: Array<Array<string>>;
}

export default class Client {
    static axiosCancelToken: CancelTokenSource = axios.CancelToken.source();

    /**
     * Gets the list of maps
     */
    public static async maps(): Promise<Array<IMapObject>> {
        const result = await axios.get("/maps/");
        return result.data;
    }

    /**
     * Calculates the next move for the AI
     */
    public static async calculateMove(currentGameState: ICalculateMoveDTO): Promise<ICalculateMoveResponse> {
        const result = await axios.post("/calculatemove/", currentGameState, {
            cancelToken: Client.axiosCancelToken.token,
        });

        return result.data;
    }

    public static cancelRequest(message: string = "Request canceled"): void {
        Client.axiosCancelToken.cancel(message);
    }
}
