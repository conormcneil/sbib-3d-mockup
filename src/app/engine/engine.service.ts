import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { Coordinate } from 'coordinate-systems';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private scene: THREE.Scene;
    private light: THREE.DirectionalLight;
    private loader: OBJLoader;
    private model: THREE.Object3D;
    private raycaster: THREE.Raycaster;
    private mousePosition: THREE.Vector2;
    private cartesianCoordinate: Coordinate;
    private sphericalCoordinate: Coordinate;

    private frameId: number = null;

    public constructor(private ngZone: NgZone) { }

    public ngOnDestroy(): void {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    public loaderCallback(obj: THREE.Object3D): void {
        this.model.add(obj);
        this.model.name = '67P';

        this.scene.add(this.model);
    }

    public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // create the scene
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.z = 5;
        this.scene.add(this.camera);

        // set user controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableZoom = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        // soft white light
        this.light = new THREE.DirectionalLight(0xffffff, 0.50);
        this.light.position.z = 10;
        this.scene.add(this.light);

        this.light = new THREE.DirectionalLight(0xffffff, 0.25);
        this.light.position.z = -10;
        this.scene.add(this.light);

        this.light = new THREE.DirectionalLight(0xffffff, 0.50);
        this.light.position.y = 10;
        this.scene.add(this.light);

        this.light = new THREE.DirectionalLight(0xffffff, 0.25);
        this.light.position.y = -10;
        this.scene.add(this.light);

        // load the model
        this.model = new THREE.Object3D();
        this.loader = new OBJLoader();
        this.loader.load('assets/67P.obj', (obj: THREE.Object3D) => this.loaderCallback(obj));
    }

    public onClick( event: MouseEvent ): void {
        event.preventDefault();

        this.mousePosition = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.mousePosition.x =  ( ( event.clientX - this.canvas.clientLeft ) / this.canvas.width  ) * 2 - 1;
        this.mousePosition.y = -( ( event.clientY - this.canvas.clientTop  ) / this.canvas.height ) * 2 + 1;
        
        this.raycaster.setFromCamera( this.mousePosition, this.camera );
        try {
            let intersection = this.raycaster.intersectObjects( this.scene.getObjectByName('67P').children, true )[0].point;

            this.cartesianCoordinate = Coordinate.cartesian( [ intersection.x, intersection.y, intersection.z ] );
            this.sphericalCoordinate = Coordinate.spherical(this.cartesianCoordinate.spherical());
            
            console.log(this.sphericalCoordinate);
        } catch (err) {
            // if click does not intersect object, do nothing
        }
    }

    public animate(): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
                this.renderer.domElement.addEventListener( 'click', ( event: any ) => this.onClick( event ) );
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
            });
        });
    }

    public render(): void {
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });

        this.renderer.render(this.scene, this.camera);
    }

    public resize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}