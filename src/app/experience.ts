import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	Component,
} from "@angular/core";
import { NgtCanvas } from "angular-three";

@Component({
	standalone: true,
	template: ``,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {
	Math = Math;
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
