import React from 'react';
import styled from 'styled-components'
import MapCanvas from './components/mapCanvas/MapCanvas';
import { createMapDataFromNoise, createNoiseMap } from './utils/maps';

const VIEWPORT_WIDTH = 1024
const VIEWPORT_HEIGHT = 640
const Main = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`

const DEBUG_MAP_W = 84
const DEBUG_MAP_H = 84
const noiseMap = createNoiseMap({
  width: DEBUG_MAP_W,
  height: DEBUG_MAP_H
})
const mapData = createMapDataFromNoise(noiseMap)

const App: React.FC = () => {
  return (
    <Main>
      <MapCanvas
        viewportWidth={VIEWPORT_WIDTH}
        viewportHeight={VIEWPORT_HEIGHT}
        mapData={mapData}
      />
    </Main>
  );
}

export default App;
