const randomUnitVector = () => {
    const theta = Math.random() * 2 * Math.PI
    return [
        Math.cos(theta),
        Math.sin(theta)
    ]
}

// https://www.youtube.com/watch?v=MJ3bvCkHJtE
interface PerlinNoiseProps {
    width: number
    height: number
    nodeCount?: number
    wrapX?: boolean
    wrapY?: boolean
}
export const createPerlinNoise = (props: PerlinNoiseProps): number[][] => {
    const { width, height, nodeCount = 8, wrapX = true, wrapY = false } = props
    const grid: number[][][] = []
    const nodeLength = 1 / (nodeCount)
    // In each grid cell, assign a gradient vector pointing a random direction
    for (let y = 0; y < (wrapY ? nodeCount : nodeCount + 1); y++) {
        const row: number[][] = []
        for(let x = 0; x < (wrapX ? nodeCount : nodeCount + 1); x++) {
            row.push(randomUnitVector())
        }
        grid.push(row)
    }

    const createNoise = (x: number, y: number) => {
        // Determine (x, y) in relation to nodes in grid
        const x0 = Math.floor(x * nodeCount)
        const x1 = wrapX ? (x0 + 1) % nodeCount : x0 + 1
        const y0 = Math.floor(y * nodeCount)
        const y1 = wrapY ? (y0 + 1) % nodeCount : y0 + 1
        const isWrapX = x1 === 0
        const isWrapY = y1 === 0
        /*
            Take the 4 grid corners that enclose point Z
            A - - - - - B
            |           |
            |           |
            |       X   |
            C - - - - - D
            For corners ABCD, calculate dot product of
            1. Random gradient of corner X
            2. Gradient from corner X to Z
        */
        const getDotProduct = (cornerX: number, cornerY: number) => {
            const [randomDX, randomDY] = grid[cornerY][cornerX]
            const coordDY = isWrapY && cornerY === 0 ? (1 - y) : (y - cornerY) 
            const coordDX = isWrapX && cornerX === 0 ? (1 - x) : (x - cornerX)
            return (randomDX * coordDX) + (randomDY * coordDY)
            
        }
        const dotA = getDotProduct(x0, y0)
        const dotB = getDotProduct(x1, y0)
        const dotC = getDotProduct(x0, y1)
        const dotD = getDotProduct(x1, y1)
        /*
            Bilinear Interpolation between dot products
                     FracX
                   <------> <-->
                  ^A - - - - - B
            FracY ||           |
                  v|           |
                   |       X   |
                   C - - - - - D
            AB = DotA + FracX * (DotB - DotA)
            CD = DotC + FracX * (DotD - DotC)
            value = AB + FracY * (CD - AB)
        */
        const fracX = (x - x0 * nodeLength) / nodeLength
        const fracY = (y - y0 * nodeLength) / nodeLength
        const AB = dotA + fracX * (dotB - dotA)
        const CD = dotC + fracX * (dotD - dotC)
        return AB + fracY * (CD - AB)
    }
    
    // Create a (width x height) grid with noise at each cell
    let maxVal = Number.MIN_VALUE
    let minVal = Number.MAX_VALUE
    const out: number[][] = []
    for(let y = 0; y < height; y++) {
        const row: number[] = []
        for(let x = 0; x < width; x++) {
            const noise = createNoise(x / width, y / height)
            if(noise > maxVal) maxVal = noise
            if(noise < minVal) minVal = noise
            row.push(noise)
        }
        out.push(row)
    }
    
    // Return normalized
    return out.map(row => {
        return row.map(cell => {
            return (cell - minVal) / (maxVal - minVal)
        })
    })
}
