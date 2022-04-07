import { TileBase } from "../enums/tiles"

export type MapTile = {
    base: TileBase
}
export type MapData = {
    tiles: MapTile[][]
}