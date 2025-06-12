// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

// Bitmaps can cause texture issues on iOS. This workaround can help prevent black textures and crashes.
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}

import './styles.css'
import firearmdata from './firearm-data'

let geocoder
let city
let stateProvinceCountry
let deathRate
let deathLevel
window.google = google

AFRAME.registerComponent('warningsignsframe', {
  schema: {
    name: {type: 'string'},
  },
  init() {
    const {object3D} = this.el
    const {name} = this.data
    object3D.visible = false

    const aEntityEl = document.createElement('a-entity')
    this.el.appendChild(aEntityEl)

    const frameEl = document.createElement('a-image')
    frameEl.setAttribute('position', '0 -0.12 0')
    frameEl.setAttribute('width', '0.765')
    frameEl.setAttribute('height', '1')
    frameEl.setAttribute('src', '#warning-sign')
    aEntityEl.appendChild(frameEl)

    // Instantiate the element with the location name
    const locationDisplay = document.createElement('a-text')
    locationDisplay.setAttribute('location-info', '')
    locationDisplay.object3D.position.set(0, -0.5, 0)
    aEntityEl.appendChild(locationDisplay)

    const getDangerPos = () => {
      let dangerPos
      switch (deathLevel) {
        case 1:
          dangerPos = '-0.115 -0.215 0.01'
          break
        case 2:
          dangerPos = '-0.07 -0.16 0.01'
          break
        case 3:
          dangerPos = '0 -0.13 0.01'
          break
        case 4:
          dangerPos = '0.08 -0.16 0.01'
          break
        case 5:
          dangerPos = '0.115 -0.215 0.01'
      }
      return dangerPos
    }

    const getDangerRot = () => {
      let dangerRot
      switch (deathLevel) {
        case 1:
          dangerRot = '0 0 75'
          break
        case 2:
          dangerRot = '0 0 38'
          break
        case 3:
          dangerRot = '0 0 0'
          break
        case 4:
          dangerRot = '0 0 -38'
          break
        case 5:
          dangerRot = '0 0 -75'
      }
      return dangerRot
    }

    // Instantiate the element with the danger level pointer
    const dangerPointer = document.createElement('a-plane')
    dangerPointer.setAttribute('danger-pointer', '')
    dangerPointer.setAttribute('color', '#000')
    dangerPointer.setAttribute('height', '0.24')
    dangerPointer.setAttribute('width', '0.012')
    dangerPointer.setAttribute('position', getDangerPos())
    dangerPointer.setAttribute('rotation', getDangerRot())
    aEntityEl.appendChild(dangerPointer)

    const showImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      document.querySelector('body').classList.add('found-img')
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }

    const hideImage = ({detail}) => {
      if (name != detail.name) {
        return
      }
      document.querySelector('body').classList.remove('found-img')
      object3D.visible = false
    }

    this.el.sceneEl.addEventListener('xrimagefound', showImage)
    this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    this.el.sceneEl.addEventListener('xrimagelost', hideImage)
  },
})

AFRAME.registerComponent('location-info', {
  schema: {
    location: {default: ''},
  },
  init() {
    // Limit title to 20 characters
    const locText = `${city.long_name}, ${stateProvinceCountry.short_name}`
    const locWidth = locText.length > 17 ? 1.0 : 1.5
    const upperLoc = locText.toUpperCase()
    const text = upperLoc
    const textData = {
      align: 'center',
      width: locWidth,
      value: text,
      color: 'black',
      font: 'kelsonsans',
    }

    this.el.setAttribute('text', textData)
  },
})

AFRAME.registerComponent('danger-pointer', {
  schema: {
    danger: {default: ''},
  },
  init() {
    // Limit title to 20 characters
    const dangerData = {
      color: '#000',
      height: '0.24',
      width: '0.012',
    }

    this.el.setAttribute('danger', dangerData)
  },
})

AFRAME.registerPrimitive('warningsigns-frame', {
  defaultComponents: {
    warningsignsframe: {},
  },

  mappings: {
    name: 'warningsignsframe.name',
  },
})

const getDeathRate = () => {
  for (let i = 0; i < firearmdata.length; i++) {
    if (firearmdata[i].YEAR == '2021' && firearmdata[i].STATE == stateProvinceCountry.short_name) {
      // this is the object you are looking for
      deathRate = firearmdata[i].RATE
      console.log(`The death rate is ${deathRate}`)
      break
    }
  }
}

const getDangerLevel = () => {
  if (deathRate >= 27.8) {
    deathLevel = 5
  } else if (deathRate >= 21.2 && deathRate < 27.8) {
    deathLevel = 4
  } else if (deathRate >= 14.9 && deathRate < 21.2) {
    deathLevel = 3
  } else if (deathRate >= 9 && deathRate < 14.9) {
    deathLevel = 2
  } else {
    deathLevel = 1
  }
}

async function codeLatLng(lat, lng) {
  const latlng = await new google.maps.LatLng(lat, lng)

  geocoder.geocode({'latLng': latlng}, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        console.log(results[0])
        // find country name
        for (let i = 0; i < results[0].address_components.length; i++) {
          for (let b = 0; b < results[0].address_components[i].types.length; b++) {
            // find city name
            if (results[0].address_components[i].types[b] == 'locality') {
              city = results[0].address_components[i]
              break
            }
            // find state, province or country name
            if (results[0].address_components[i].types[b] == 'administrative_area_level_1') {
              stateProvinceCountry = results[0].address_components[i]
              break
            }
          }
        }
        // city data
        console.log(`${city.long_name}, ${stateProvinceCountry.short_name}`)

        getDeathRate()
        getDangerLevel()
      } else {
        console.log('No results found')
      }
    } else {
      console.log(`Geocoder failed due to: ${status}`)
    }
  })
}

const successFunction = (position) => {
  const lat = position.coords.latitude
  const lng = position.coords.longitude
  codeLatLng(lat, lng)
}

const errorFunction = () => {
  console.log('Geocoder failed')
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction)
  }
}

const init = () => {
  geocoder = new google.maps.Geocoder()
  getLocation()
}

const onxrloaded = () => {
  XR8.CanvasScreenshot.configure({maxDimension: 1920, jpgCompression: 100})
}

// add 'Tap + Hold to Add to Photos' prompt when user takes a photo
window.addEventListener('mediarecorder-photocomplete', () => {
  document.getElementById('overlay').style.display = 'block'
})

// hide 'Tap + Hold to Add to Photos' prompt when user dismisses preview modal
window.addEventListener('mediarecorder-previewclosed', () => {
  document.getElementById('overlay').style.display = 'none'
})

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

init()
