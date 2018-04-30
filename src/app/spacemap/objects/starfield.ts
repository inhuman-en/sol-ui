import { Geometry, Math, Vector3, Points, PointsMaterial } from 'three';

let starsGeometry = new Geometry();

for (let i = 0; i < 10000; i++) {
    let star = new Vector3();
    star.x = Math.randFloatSpread(2000);
    star.y = Math.randFloatSpread(2000);
    star.z = Math.randFloatSpread(2000);

    starsGeometry.vertices.push(star);
}

let starsMaterial = new PointsMaterial({ color: 0x888888 });

let starfield = new Points(starsGeometry, starsMaterial);

export {starfield};
