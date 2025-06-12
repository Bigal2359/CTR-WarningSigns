# CTR-WarningSigns

This is AR web app built on the 8th Wall platform that lives [here](https://www.8thwall.com/alexridore/warning-signs/project)

## Flat Image Targets based in A-Frame

This A-Frame example project showcases two flat image targets in a single scene.

![](https://media.giphy.com/media/k3N5XiEMNDRFWQVJZO/giphy.gif)

### Scene Image Targets

![](https://i.imgur.com/q1CnjG0.jpg)

### Flat Image Target Components & Primitives

```<xrextras-named-image-target>``` tracks an image target. Add content inside to copy the 
transforms from the tracked target to its children.

- name: the name of the image target as it appears on the "Image Targets" page

```xrextras-play-video``` displays a thumbnail image and waits for user tap to begin 
playback (for videos with sound).

- video: the id of the <video> element used for playback
- thumb: the id of the <img> element to serve as a thumbnail (optional)
- canstop: whether the video can be paused on tap
 
```xrextras-gesture-detector``` listens for touch gestures when added to the <a-scene> tag. 
Required for gesture components:

- xrextras-one-finger-rotate
- xrextras-two-finger-rotate
- xrextras-pinch-scale
- xrextras-hold-drag

```xrextras-one-finger-rotate``` lets the user drag along x axis to spin object around y axis.

- factor: increase this number to spin more given the same drag distance (default: 6)

Check out the source code for these XRExtras components on 
[Github](https://github.com/8thwall/web/blob/master/xrextras/src/aframe/xr-components.js).

#### Attribution

Jellyfish by [Google Poly](https://poly.google.com/view/dA5osnS0Rzj)

---

Learn more about Image Targets in our 
[documentation](https://www.8thwall.com/docs/web/#image-targets).
