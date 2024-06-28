- Use this code for the first green cube

```ts
import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
} from "@angular/core";
import { NgtCanvas, extend } from "angular-three";
import * as THREE from "three";

extend(THREE);

@Component({
	standalone: true,
	template: `
		<ngt-mesh>
			<ngt-box-geometry />
			<ngt-mesh-basic-material color="green" />
		</ngt-mesh>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {}

@Component({
	selector: "app-experience",
	standalone: true,
	template: `
		<ngt-canvas [sceneGraph]="scene" />
	`,
	imports: [NgtCanvas],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: `
		:host {
			display: block;
			height: 100dvh;
		}
	`,
})
export class Experience {
	scene = Scene;
}
```

- Use this code for animation demo

```ts
@Component({
	standalone: true,
	template: `
		<ngt-mesh #mesh>
			<ngt-box-geometry />
			<ngt-mesh-basic-material color="green" />
		</ngt-mesh>
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {
	mesh = viewChild.required<ElementRef<Mesh>>("mesh");

	constructor() {
		injectBeforeRender(() => {
			const mesh = this.mesh().nativeElement;
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.01;
		});
	}
}
```

- lighting

```html
<ngt-color *args="['#303030']" attach="background" />
<ngt-ambient-light [intensity]="0.8" />
<ngt-point-light [intensity]="Math.PI" [decay]="0" [position]="[0, 6, 0]" />
```

- bot

```ts
type BotGLTF = GLTF & {
	nodes: {
		"Y-Bot": Object3D;
		YB_Body: SkinnedMesh;
		YB_Joints: SkinnedMesh;
		mixamorigHips: Bone;
	};
	materials: { YB_Body: MeshStandardMaterial; YB_Joints: MeshStandardMaterial };
};

@Directive({ selector: "[animations]", standalone: true })
export class BotAnimations {
	animations = input.required<NgtsAnimation>();
	host = inject<ElementRef<Group>>(ElementRef);
	animationsApi = injectAnimations(this.animations, this.host);

	constructor() {
		effect((onCleanup) => {
			if (this.animationsApi.ready()) {
				const actionName = selectedAction();
				this.animationsApi.actions[actionName]?.reset().fadeIn(0.5).play();
				onCleanup(() => {
					this.animationsApi.actions[actionName]?.fadeOut(0.5);
				});
			}
		});
	}
}

@Component({
	selector: "app-bot",
	standalone: true,
	template: `
		<ngt-group [position]="[0, -1, 0]">
			<ngt-grid-helper *args="[10, 20]" />
			@if (gltf(); as gltf) {
				<ngt-group [dispose]="null" [animations]="gltf">
					<ngt-group [rotation]="[Math.PI / 2, 0, 0]" [scale]="0.01">
						<ngt-primitive *args="[gltf.nodes.mixamorigHips]" />
						<ngt-skinned-mesh
							[geometry]="gltf.nodes.YB_Body.geometry"
							[skeleton]="gltf.nodes.YB_Body.skeleton"
						>
							<ngt-mesh-matcap-material [matcap]="matcapBody.texture()" />
						</ngt-skinned-mesh>
						<ngt-skinned-mesh
							[geometry]="gltf.nodes.YB_Joints.geometry"
							[skeleton]="gltf.nodes.YB_Joints.skeleton"
						>
							<ngt-mesh-matcap-material [matcap]="matcapJoints.texture()" />
						</ngt-skinned-mesh>
					</ngt-group>
				</ngt-group>
			}
		</ngt-group>
	`,
	imports: [NgtArgs, BotAnimations],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bot {
	Math = Math;

	gltf = injectGLTFLoader(() => "./ybot.glb") as Signal<BotGLTF | null>;
	matcapBody = injectMatcapTexture(() => "293534_B2BFC5_738289_8A9AA7");
	matcapJoints = injectMatcapTexture(() => "3A2412_A78B5F_705434_836C47");
}
```

- select

```html
<div style="position: absolute; top: 0; right: 0">
	<select
		[value]="selectAnimation()"
		(change)="selectAnimation.set($any($event).target.value)"
	>
		<option value="Dance">Dance</option>
		<option value="Strut">Strut</option>
		<option value="Idle">Idle</option>
	</select>
</div>
```
