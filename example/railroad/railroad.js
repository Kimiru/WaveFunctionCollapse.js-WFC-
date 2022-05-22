const { Direction, CollapseMethods, DirectionOffset, Prototype, WaveFunctionCollapse } = require('../../commonjs/WaveFunctionCollapse')
const fs = require('fs')
const { createCanvas } = require('canvas')

const mapWidth = 13
const mapHeight = 13
const tileSize = 10

const canvasWidth = mapWidth * tileSize
const canvasHeight = mapHeight * tileSize

ids = ['grass', 'track_station',
    'track_horizontal', 'track_vertical', 'track_cross',
    'track_end_left', 'track_end_top', 'track_end_right', 'track_end_bottom',
    'track_corner_left_top', 'track_corner_left_bottom', 'track_corner_right_top', 'track_corner_right_bottom']

let wfc = new WaveFunctionCollapse(mapWidth, mapHeight)

wfc.addPrototype(
    new Prototype('grass', { left: '0s', right: '0s', top: '0s', bottom: '0s' }, 10),
    new Prototype('track_station', { left: '1s', right: '1s', top: 'towns', bottom: '0s' }, 1, { left: '1s', right: '1s', top: '', bottom: '' }),
    // new Prototype('track_cross', { left: '1s', right: '1s', top: '1s', bottom: '1s' }),
    ...new Prototype('track_tri_cross', { left: '1s', right: '1s', top: '1s', bottom: '0s' }, 1, { left: '2s', right: '2s', top: '2s', bottom: '2s' }).rotate360(),
    ...new Prototype('track_straight', { left: '1s', right: '1s', top: '0s', bottom: '0s' }, 1).rotateRight(),
    // ...new Prototype('track_end', { left: '0s', right: '0s', top: '1s', bottom: '-1s' }).rotate360(),
    ...new Prototype('track_corner', { left: '1s', right: '0s', top: '1s', bottom: '0s' }, 1, { left: '3s', right: '3s', top: '3s', bottom: '3s' }).rotate360(),
    new Prototype('town', { left: '0s', right: '0s', top: '0s', bottom: 'towns' })
)
wfc.collapseMethod = CollapseMethods.servWeightedRandom

// console.log(wfc.prototypes.get('track_corner').antineighbours)

do {

    wfc.reset()

    wfc.set(Math.floor(mapWidth / 2), 0, ['track_straight_1'])
    wfc.set(Math.floor(mapWidth / 2), mapHeight - 1, ['track_straight_1'])
    wfc.set(0, Math.floor(mapHeight / 2), ['track_straight'])
    wfc.set(mapWidth - 1, Math.floor(mapHeight / 2), ['track_straight'])
    wfc.ring(['grass'])


} while (!wfc.runTocompletion())

const canvas = createCanvas(canvasHeight, canvasWidth)
const ctx = canvas.getContext('2d')
ctx.save()
ctx.scale(1, -1)
ctx.translate(0, -canvasHeight)

let missing = new Set()

for (let index = 0; index < wfc.map.length; index++) {
    let x = Math.floor(index / wfc.height)
    let y = index % wfc.height

    let cell = wfc.get(x, y).values().next().value
    // console.log(cell)

    ctx.fillStyle = '#0f0'
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
    if (cell == 'grass') { }

    else if (cell == 'track_station') {
        ctx.fillStyle = '#f00'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize, tileSize * .4)
    }

    else if (cell == 'track_cross') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize)
    }

    else if (cell == 'track_tri_cross') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize + tileSize * .5, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_tri_cross_1') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + tileSize * .5, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize)
    }

    else if (cell == 'track_tri_cross_2') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_tri_cross_3') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize)
    }

    else if (cell == 'track_straight') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize, tileSize * .4)
    }

    else if (cell == 'track_straight_1') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize)
    }

    else if (cell == 'track_end') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize + tileSize * .5, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_end_2') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_end_1') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + tileSize * .5, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
    }

    else if (cell == 'track_end_3') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
    }

    else if (cell == 'track_corner') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize + tileSize * .5, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_corner_1') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + tileSize * .5, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize + tileSize * .5, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_corner_2') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize + tileSize * .5, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'track_corner_3') {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(x * tileSize, y * tileSize + .3 * tileSize, tileSize * .5, tileSize * .4)
        ctx.fillRect(x * tileSize + .3 * tileSize, y * tileSize, tileSize * .4, tileSize * .5)
    }

    else if (cell == 'town') {
        ctx.fillStyle = '#aa0'
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
    }

    else {
        missing.add(cell)
    }

}

for (let miss of missing)
    console.log('missing texture for: ' + miss)



ctx.restore()

fs.writeFileSync('./images.png', canvas.toBuffer('image/png'))
