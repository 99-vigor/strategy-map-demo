import { TileBase } from "./enums/tiles"
import { TileSlice } from "./types/tiles"

// Tiles
// TODO: make arbitrary / flexible
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 80
export const TILE_MARGIN = 24
// TODO: tie to tileset data
export const TILE_BASE_SLICES: {[key in TileBase]: TileSlice} = {
  ocean: { x: 0, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  coast: { x: TILE_WIDTH, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  desert: { x: TILE_WIDTH * 2, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  plains: { x: TILE_WIDTH * 3, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  grass: { x: TILE_WIDTH * 4, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  tundra: { x: TILE_WIDTH * 5, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
  snow: { x: TILE_WIDTH * 6, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT },
}