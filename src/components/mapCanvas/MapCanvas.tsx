import {
    useState,
    useEffect,
    useRef,
    FC,
    MouseEventHandler,
    WheelEventHandler
} from 'react'
import styled from 'styled-components'
import tilesImgPath from '../../assets/tiles.png'
import { Vector } from '../../types/tiles'
import { toDigits } from '../../utils/numbers'
import { drawMap } from './canvasHelper'
import { MapData } from '../../types/mapData'
import { TILE_HEIGHT, TILE_MARGIN, TILE_WIDTH } from '../../constants'

interface CanvasWrapperProps {
    width: number
    height: number
}
const CanvasWrapper = styled.div<CanvasWrapperProps>`
    position: relative;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border: 2px solid black;
    margin: 32px;
    z-index: 10;
    overflow: hidden;
`
const DebugWindow = styled.div`
    position: absolute;
    z-index: 999;
    bottom: 32px;
    right: 32px;
    border: 1px solid white;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 16px;
    border-radius: 8px;
    ul {
    padding-left: 16px;
    margin: 0px;
    }
`
interface MapCanvasProps {
    viewportWidth: number
    viewportHeight: number
    mapData: MapData
}
// Resources
const tilesImg = new Image()
tilesImg.src = tilesImgPath

const MapCanvas: FC<MapCanvasProps> = props => {
    const {
        viewportWidth,
        viewportHeight,
        mapData
    } = props
    const mapRowCount = mapData.tiles.length
    const mapColCount = mapData.tiles[0].length

    // Render
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [ tilesLoaded, setTilesLoaded ] = useState(false)
    const [ cameraOffset, setCameraOffset ] = useState<Vector>({ x: 0, y: 0 })
    tilesImg.onload = () => {
        setTilesLoaded(true)
    }
    const reboundCameraOffset = (offset: Vector, scale: number) => {
        const mapWidth = mapColCount * TILE_WIDTH
        const mapHeight = mapRowCount * (TILE_HEIGHT - TILE_MARGIN) + TILE_MARGIN
        const { x: oldX, y: oldY } = offset
        const topEdge = (viewportHeight * (1 - 1/scale)) / 2
        const bottomEdge = topEdge + (-mapHeight + (viewportHeight / scale))
        return {
        x: oldX < 0 ?
            oldX % mapWidth :
            oldX - mapWidth,
        y: Math.min(
            Math.max(oldY, bottomEdge),
            topEdge
        )
        }
    }

    // Input
    const [ mouseCoord, setMouseCoord ] = useState<Vector>({ x: -1, y: -1 })
    const [ zoom, setZoom ] = useState(1)
    const [ isDragging, setIsDragging ] = useState(false)
    const [ showDebug, setShowDebug ] = useState(true)

    // Handlers
    const mouseMoveHandler: MouseEventHandler<HTMLCanvasElement> = e => {
    const { clientX, clientY } = e
        if(isDragging) {
            const xChange = (clientX - mouseCoord.x) / zoom
            const yChange = (clientY - mouseCoord.y) / zoom

            const effX = cameraOffset.x + xChange
            const effY = cameraOffset.y + yChange
            
            const checkedOffset = reboundCameraOffset({ x: effX, y: effY }, zoom)
            setCameraOffset(checkedOffset)
        }
        setMouseCoord({ x: e.clientX, y: e.clientY })
    }
    const mouseDownHandler: MouseEventHandler<HTMLCanvasElement> = e => {
        setIsDragging(true)
    }
    const mouseUpHandler: MouseEventHandler<HTMLCanvasElement> = e => {
        setIsDragging(false)
    }
    const mouseLeaveHandler: MouseEventHandler<HTMLCanvasElement> = e => {
        setIsDragging(false)
    }
    
    const onScrollHandler: WheelEventHandler<HTMLCanvasElement> = e => {
        const { deltaY } = e
        // Zoom scale
        const newZoom = deltaY > 0 ?
            Math.max(zoom - 0.1, 0.3) : // zoom out
            Math.min(zoom + 0.1, 2.5)   // zoom in
        setZoom(newZoom)
        setCameraOffset(reboundCameraOffset(cameraOffset, newZoom))
    }
    // Keypress Logic
    useEffect(() => {
        const keyPressHandler = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'd':
                setShowDebug(!showDebug)
                break
            }
        }
        window.addEventListener('keypress', keyPressHandler)
        return () => {
            window.removeEventListener('keypress', keyPressHandler)
        }
    }, [showDebug, setShowDebug])

    // Canvas Paint
    useEffect(() => {
        if(!tilesLoaded) return
        const context2d = canvasRef.current?.getContext('2d')
        if(!context2d) return
        // drawPerlinNoise(g)
        drawMap({
            tilesImg, context2d, offset: cameraOffset, scale: zoom,
            viewportWidth, viewportHeight, mapData
        })
    }, [tilesLoaded, cameraOffset, zoom])

    return (
        <CanvasWrapper width={viewportWidth} height={viewportHeight}>
            <canvas
                ref={canvasRef}
                width={viewportWidth}
                height={viewportHeight}
                onMouseMove={mouseMoveHandler}
                onMouseDown={mouseDownHandler}
                onMouseLeave={mouseLeaveHandler}
                onMouseUp={mouseUpHandler}
                onWheel={onScrollHandler}
            />
            { showDebug && <DebugWindow>
            <ul>
                <li>Mouse: ({mouseCoord.x}, {mouseCoord.y})</li>
                <li>Camera Offset: ({toDigits(cameraOffset.x, 1)}, {toDigits(cameraOffset.y, 1)})</li>
                <li>Zoom: {toDigits(zoom, 2)}</li>
            </ul>
            </DebugWindow> }
        </CanvasWrapper>
    )
}

export default MapCanvas