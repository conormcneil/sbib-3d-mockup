import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { Coordinate } from 'coordinate-systems';
import { FootprintService } from '../footprint.service';
import { ImageHandlerService } from '../image-handler.service';
import Image from '../models/Image';

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
    private coordinate: Coordinate;
    private footprintService: FootprintService;
    private footprint: Array<any>;
    private points: Array<THREE.Vector3>;
    private origin: THREE.Vector3;
    public currentImage: Image;

    private frameId: number = null;

    public constructor(private ngZone: NgZone, private imageHandler: ImageHandlerService) {
        // THREE.Object3D.DefaultUp.set( 0, 0, 1 );
        this.origin = new THREE.Vector3( 0, 0, 0 );
    }

    public ngOnInit(): void {
        this.imageHandler.currentImage.subscribe(currentImage => {
            console.log(currentImage);
            
            this.currentImage = currentImage;
        });
    }

    public ngOnDestroy(): void {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    public loaderCallback(obj: THREE.Object3D): void {
        this.model.add(obj);
        this.model.name = '67P';

        this.scene.add(this.model);
        this.drawAxes();
        this.drawFootprint();
    }

    public drawAxes(): void {
        // DRAW AXES
        const materialX = {
            solid: new THREE.LineBasicMaterial( { color: 0xff0000 } ),
            dashed: new THREE.LineDashedMaterial( { linewidth: 1, scale: 1, dashSize: 3, gapSize: 1, color: 0xff9999 } )
        }
        const materialY = {
            solid: new THREE.LineBasicMaterial( { color: 0x00ff00 } ),
            dashed: new THREE.LineDashedMaterial( { linewidth: 1, scale: 1, dashSize: 3, gapSize: 1, color: 0x99ff99 } )
        }
        const materialZ = {
            solid: new THREE.LineBasicMaterial( { color: 0x0000ff } ),
            dashed: new THREE.LineDashedMaterial( { linewidth: 1, scale: 1, dashSize: 3, gapSize: 1, color: 0x9999ff } )
        }
        
        const geometryX = {
            solid: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( 10, 0, 0 )] ),
            dashed: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( -10, 0, 0)])
        }
        const geometryY = {
            solid: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( 0, 10, 0 )] ),
            dashed: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( 0, -10, 0)])
        }
        const geometryZ = {
            solid: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( 0, 0, 10 )] ),
            dashed: new THREE.BufferGeometry().setFromPoints( [ this.origin, new THREE.Vector3( 0, 0, -10)])
        }

        const positiveAxisX = new THREE.Line( geometryX.solid, materialX.solid );
        const negativeAxisX = new THREE.Line( geometryX.dashed, materialX.dashed );
        const positiveAxisY = new THREE.Line( geometryY.solid, materialY.solid );
        const negativeAxisY = new THREE.Line( geometryY.dashed, materialY.dashed );
        const positiveAxisZ = new THREE.Line( geometryZ.solid, materialZ.solid );
        const negativeAxisZ = new THREE.Line( geometryZ.dashed, materialZ.dashed );

        // RED
        this.scene.add( positiveAxisX );
        this.scene.add( negativeAxisX );
        // GREEN
        this.scene.add( positiveAxisY );
        this.scene.add( negativeAxisY );
        // BLUE
        this.scene.add( positiveAxisZ );
        this.scene.add( negativeAxisZ );
    }

    public drawFootprint(): void {
        this.footprintService = new FootprintService(this.imageHandler);
        this.footprintService.getFootprint();

        this.footprint = this.footprintService.footprint;
        console.log(this.footprint);
        

        function degreesToRadians(degrees) {
            return degrees * (Math.PI/180);
        }

        this.footprint.map(coordinate => {
            this.points = [this.origin];

            let radius = coordinate[0];
            let theta = coordinate[1]; // degrees
            let phi = coordinate[2]; // degrees
            
            let lat = degreesToRadians(90 - theta);
            let lon = degreesToRadians(phi);
            
            let x = radius * Math.cos(lat) * Math.cos(lon);
            let y = radius * Math.cos(lat) * Math.sin(lon);
            let z = radius * Math.sin(lat);

            const point = new THREE.Vector3( x, y, z );
            
            this.points.push(point);
            
            const geometryFootprint = new THREE.BufferGeometry().setFromPoints( this.points );
            const materialFootprint = new THREE.LineBasicMaterial( { color: 0xf0f0f0 } );
            const line = new THREE.Line( geometryFootprint, materialFootprint );
            this.scene.add( line );
    
            this.render();
        });
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

        this.camera.position.x = 10;
        this.camera.position.y = 10;
        this.camera.position.z = 10;
        
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

            this.coordinate = Coordinate.cartesian( [ intersection.x, intersection.y, intersection.z ] );
            
            console.log(this.coordinate);
        } catch (err) {
            // if click does not intersect object, do nothing
            // console.error(err);
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