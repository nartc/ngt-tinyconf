import { Component } from "@angular/core";
import { Experience } from "./experience";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [Experience],
	template: `
		<app-experience />
	`,
})
export class AppComponent {}
