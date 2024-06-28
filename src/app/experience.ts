import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	computed,
	effect,
	signal,
	viewChild,
} from "@angular/core";
import { NgtArgs, NgtCanvas, extend, injectBeforeRender } from "angular-three";
import * as THREE from "three";
import { Mesh } from "three";

extend(THREE);

@Component({
	standalone: true,
	template: `
		<ngt-mesh #mesh>
			<ngt-box-geometry *args="boxArgs()" />
			<ngt-mesh-basic-material color="green" />
		</ngt-mesh>
	`,
	imports: [NgtArgs],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {
	Math = Math;

	mesh = viewChild.required<ElementRef<Mesh>>("mesh");
	isBig = signal(true);
	boxArgs = computed(() => (this.isBig() ? [2, 2, 2] : [1, 1, 1]));

	constructor() {
		injectBeforeRender(() => {
			const mesh = this.mesh().nativeElement;
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.01;
		});

		effect((onCleanup) => {
			const id = setInterval(() => {
				this.isBig.update((prev) => !prev);
			}, 2000);
			onCleanup(() => clearInterval(id));
		});
	}
}

@Component({
	selector: "app-experience",
	standalone: true,
	template: `
		<ngt-canvas
			[sceneGraph]="scene"
			[camera]="{ fov: 75, position: [0, 0, 3] }"
			[shadows]="true"
		/>
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
