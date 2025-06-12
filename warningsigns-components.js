const warningSignsFrameComponent = () => ({
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

const locationInfoComponent = () => ({
  schema: {
    location: {default: ''},
  },
  init() {
    // Limit title to 20 characters
    const locText = `${city}, ${stateProvinceCountry}`
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

const dangerPointerComponent = () => ({
  schema: {
    danger: {default: ''},
  },
  init() {
    const dangerData = {
      color: '#000',
      height: '0.24',
      width: '0.012',
    }

    this.el.setAttribute('danger', dangerData)
  },
})

const warningSignsPrimitive = () => ({
  defaultComponents: {
    warningsignsframe: {},
  },

  mappings: {
    name: 'warningsignsframe.name',
  },
})

export {warningSignsFrameComponent, locationInfoComponent, dangerPointerComponent, warningSignsPrimitive}
