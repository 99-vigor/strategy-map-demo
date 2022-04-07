import {
    TILE_BASE_SLICES,
    TILE_HEIGHT,
    TILE_MARGIN,
    TILE_WIDTH
} from "../../constants"
import { MapData } from "../../types/mapData"
import { Vector } from "../../types/tiles"

interface DrawMapProps {
    tilesImg: HTMLImageElement,
    context2d: CanvasRenderingContext2D,
    viewportWidth: number,
    viewportHeight: number,
    mapData: MapData
    offset?: Vector,
    scale?: number,
    drawTileBuffer?: number
}

export const drawMap = (props: DrawMapProps): void => {
    const {
        tilesImg,
        context2d: ctx,
        offset = { x: 0, y: 0 },
        scale = 1,
        drawTileBuffer = 1,
        mapData,
        viewportWidth,
        viewportHeight
    } = props
    const mapRowCount = mapData.tiles.length
    const mapColCount = mapData.tiles[0].length

    const effOffsetX = offset.x * scale + (1 - scale) * viewportWidth / 2
    const effOffsetY = offset.y * scale + (1 - scale) * viewportHeight / 2
    const effTileWidth = TILE_WIDTH * scale
    const effTileHeight = (TILE_HEIGHT - TILE_MARGIN) * scale
    ctx.clearRect(0, 0, TILE_WIDTH*100, TILE_HEIGHT*100)
    const leftEdge = Math.floor(-effOffsetX / effTileWidth) - drawTileBuffer
    const rightEdge = leftEdge +
        (viewportWidth / effTileWidth) + (2 * drawTileBuffer)
    const topEdge = Math.max(
        Math.floor(-effOffsetY / effTileHeight) - drawTileBuffer,
        0
    )
    const bottomEdge = Math.min(
        topEdge + (viewportHeight / effTileHeight) + (2 * drawTileBuffer),
        mapRowCount
    )
    for(let y = topEdge; y < bottomEdge; y++) {
        for(let x = leftEdge; x < rightEdge; x++) {
            // account for looping X
            const effX = x < 0 ?
                (x % mapColCount) + mapColCount :
                x % mapColCount
            const tile = mapData.tiles[y][effX]
            const slice = TILE_BASE_SLICES[tile.base]
            const xRowOffset = y % 2 === 0 ? TILE_WIDTH / 2 * scale : 0
            ctx.drawImage(
                tilesImg,
                slice.x, slice.y, slice.w, slice.h,
                effOffsetX + xRowOffset + x * TILE_WIDTH * scale,
                effOffsetY + y * (TILE_HEIGHT - TILE_MARGIN) * scale,
                TILE_WIDTH * scale,
                TILE_HEIGHT * scale
            )
        }
    }
}