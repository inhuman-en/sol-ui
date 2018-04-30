import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    Mesh,
    MeshBasicMaterial,
    ShaderMaterial,
    TextureLoader,
    Vector2,
    Vector3,
    RepeatWrapping,
    Clock
} from 'three';

import { RenderPass, BloomPass, FilmPass, EffectComposer } from 'postprocessing';

import { OrbitControls } from 'three-orbitcontrols-ts';
import { starfield } from './objects';
import * as Shaders from './shaders';
window.onload = function() {
    let scene = new Scene();
    let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    let controls = new OrbitControls(camera);

    let renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    renderer.autoClear = false;

    let geometry = new SphereGeometry(2, 300, 300);
    let textureLoader = new TextureLoader();
    let clock = new Clock();

    let uniforms = {
        fogDensity: { value: 0.05 },
        fogColor: { value: new Vector3(30, 8, 0) },
        time: { value: 1.0 },
        uvScale: { value: new Vector2(2.0, 1.0) },
        texture1: { value: textureLoader.load('/assets/textures/cloud.png') },
        texture2: { value: textureLoader.load('/assets/textures/lavatile.jpg') }
    };
    uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = RepeatWrapping;
    uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = RepeatWrapping;

    let material = new ShaderMaterial({
        uniforms,
        vertexShader: Shaders.sunVertex,
        fragmentShader: Shaders.sunFagment
    });

    // let material = new MeshBasicMaterial({ wireframe: false, map: new TextureLoader().load( "assets/textures/sun1.jpg" ) });
    let sun = new Mesh(geometry, material);

    scene.add(sun);
    scene.add(starfield);


    let renderModel = new RenderPass(scene, camera);
    let effectBloom = new BloomPass(1.50);
    let effectFilm = new FilmPass(0.15, 0.95, 2048, false);

    effectFilm.renderToScreen = true;


    
    let composer = new EffectComposer(renderer);

    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(effectFilm);

    camera.position.z = 5;

    controls.update();

    let tanFOV = Math.tan(Math.PI / 180 * camera.fov / 2);    

    let resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;

        // adjust the FOV
        camera.fov = 360 / Math.PI * Math.atan(tanFOV * (window.innerHeight / window.innerHeight));

        camera.updateProjectionMatrix();
        camera.lookAt(scene.position);

        renderer.setSize(window.innerWidth, window.innerHeight);

        // composer.reset();
    };

    resize();

    window.addEventListener('resize', resize, false);

    let render = function() {
        sun.rotation.y += 0.001;

        // renderer.render(scene, camera);

        let delta = 5 * clock.getDelta();
        uniforms.time.value += 0.2 * delta;

        renderer.clear();
        composer.render(0.01);

        controls.update();
        
    };

    let animate = function() {
        requestAnimationFrame(animate);
        render();
    };

    animate();
};
