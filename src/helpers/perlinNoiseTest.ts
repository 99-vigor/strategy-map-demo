import { TILE_HEIGHT, TILE_WIDTH } from "../constants"
import { createNoiseMap } from "../utils/maps"

export const drawPerlinNoise = (g: CanvasRenderingContext2D) => {
    g.clearRect(0, 0, TILE_WIDTH * 84, TILE_HEIGHT * 54)

    const NOISE_WIDTH = 84
    const NOISE_HEIGHT = 54
    const SCALE = 5
    
    const LAND_LEVEL = 130
    const MOUNTAIN_LEVEL = 175
    
    const noiseMap = createNoiseMap({ width: NOISE_WIDTH, height: NOISE_HEIGHT})
    g.beginPath()
    for(let y = 0; y < NOISE_HEIGHT; y++) {
      for(let x = 0; x < NOISE_WIDTH; x++) {
        let adjNoise = noiseMap[y][x]
        adjNoise = adjNoise < LAND_LEVEL-10 ? 0 : adjNoise < LAND_LEVEL ? 60 : adjNoise < MOUNTAIN_LEVEL ? 204 : 255
        g.fillStyle = `rgb(${adjNoise}, ${adjNoise}, ${adjNoise})`
        // g.fillStyle = '#FF0000'
        g.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
      }
    }
    g.stroke()
}