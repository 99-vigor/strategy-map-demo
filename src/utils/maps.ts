import { TileBase } from "../enums/tiles"
import { MapData, MapTile } from "../types/mapData"
import { createPerlinNoise } from "./noise"

interface CreateMapProps {
    width: number
    height: number
    wrapX?: boolean
    wrapY?: boolean
    nodeCountMajor?: number
    nodeCountMinor?: number
    weightMajor?: number
}

export const createNoiseMap = (props: CreateMapProps): number[][] => {
    const {
        width,
        height,
        wrapX = true,
        wrapY = false,
        nodeCountMajor = 6,
        nodeCountMinor = 12,
        weightMajor = 0.6
    } = props
    /*
      Create an organic looking map by composing two perlin noise maps:
      One low-density grid for the dominant continent shapes, and one
      high-density grid with lower weighting for fjords, peninsulas, etc
    */
    const noiseGrid = createPerlinNoise({
      width: width,
      height: height,
      nodeCount: nodeCountMajor,
      wrapX,
      wrapY
    })
    const noiseGrid2 = createPerlinNoise({
      width: width,
      height: height,
      nodeCount: nodeCountMinor,
      wrapX,
      wrapY
    })
    const out: number[][] = []
    const majorCoeff = Math.floor(weightMajor * 255)
    const minorCoeff = 255 - majorCoeff
    for(let y = 0; y < height; y++) {
        const row: number[] = []
        for(let x = 0; x < width; x++) {
          let adjNoise = Math.floor(
            noiseGrid[y][x] * majorCoeff +
            noiseGrid2[y][x] * minorCoeff
          )
          row.push(adjNoise)
        }
        out.push(row)
    }
    return out
}

export const createMapDataFromNoise = (noiseGrid: number[][]): MapData => {
  const gridRowCount = noiseGrid.length
  const outMap: MapTile[][] = []
  for(let y = 0; y < gridRowCount; y++) {
    const row: MapTile[] = []
    for(let x = 0; x < noiseGrid[y].length; x++) {
      const noise = noiseGrid[y][x]
      // Use noise intensity as elevation
      const base: TileBase =
        noise < 130 ? TileBase.OCEAN :
        noise < 140 ? TileBase.COAST :
        (y < 8 || y > gridRowCount-8) ? TileBase.TUNDRA :
        TileBase.PLAINS
      row.push({ base })
    }
    outMap.push(row)
  }
  return {
    tiles: outMap
  }
}