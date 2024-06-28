---
# You can also start simply with 'default'
theme: default
# some information about your slides (markdown enabled)
title: Learn Angular Three via live-coding
class: text-center font-xl
highlighter: shiki
transition: slide-left
mdc: true
---

# Learn Angular Three

# via live-coding

https://github.com/angular-threejs/angular-three

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

# Chau Tran

## Engineer at Nx

## nartc.me | @nartc1410

---
transition: fade-out
---

# What is Angular Three?

<v-click>

##### (_definitely_ **NOT** the missing Angular 3)

</v-click>

<br/>
<br/>

<v-click>

## Angular Three is a custom <span v-mark.orange>**Renderer**</span>

<br/>
<br/>

## that renders <span v-mark.circle.orange>**THREE.js**</span> to the Canvas

<br/>
<br/>

## using the <span v-mark.orange>_declarative_ Angular Template.</span>

</v-click>

<!--
Here is another comment.
-->

---
class: flex justify-center items-center
---

# Demo

---

# NgtCanvas

<br>
<br>

<v-click>

- Build the building block for THREE.js: `WebGLRenderer`, `Camera`, and `Scene`

</v-click>

<v-click>

- Set up Resize listener

</v-click>

<v-click>

- Set up the Event system using `Raycaster`

</v-click>

<v-click>

- Provide the custom `Renderer` for the `[sceneGraph]`

</v-click>

---

# Catalogue

<v-click>

````md magic-move
```ts {all|1|2|4|all}
import { extend } from "angular-three";
import * as THREE from "three";

extend(THREE);
```

```ts {all|2|4|all}
import { extend } from "angular-three";
import { Mesh, MeshBasicMaterial } from "three";

extend({ Mesh, MeshMasicMaterial });
```

```ts
import { extend } from "angular-three";
import { Mesh, MeshBasicMaterial } from "three";

extend({ Mesh, MeshMasicMaterial });
// Mesh - ngt-mesh
// MeshBasicMaterial - ngt-mesh-basic-material
```

```ts
import { extend } from "angular-three";
import { Mesh, MeshBasicMaterial } from "three";

extend({ Mesh, MyBasicMaterial: MeshMasicMaterial });
// Mesh - ngt-mesh
// MyBasicMaterial - ngt-my-basic-material
```
````

</v-click>

<v-click>

`extend` can be called multiple times
and will always extend a global `catalogue`

</v-click>

<!--
Notes can also sync with clicks

[click] This will be highlighted after the first click

[click] Highlighted with `count = ref(0)`

[click:3] Last click (skip two clicks)
-->

---

# Flow: Simple

```angular-html {all|1,4}
<ngt-mesh>
  <ngt-box-geometry />
  <ngt-mesh-basic-material />
</ngt-mesh>
```

<v-click>

```mermaid
sequenceDiagram;
  participant template
  participant renderer
  participant catalogue
  participant core
  Note right of core: Execute template fn
  template->>renderer: Please handle ngt-mesh
  renderer->>template: Sure!
  renderer-->>catalogue: Do we know what ngt-mesh is?
  catalogue-->>renderer: Yes. It is THREE.Mesh
  renderer->>core: Here's a THREE.Mesh instance at ngt-mesh
  Note right of core: <ngt-mesh> has the internal value as a THREE.Mesh
```

</v-click>

---

# Flow: Simple (cont.)

```angular-html {all|2}
<ngt-mesh>
  <ngt-box-geometry />
  <ngt-mesh-basic-material />
</ngt-mesh>
```

<v-click>

```mermaid
sequenceDiagram;
  participant template
  participant renderer
  participant catalogue
  participant core
  Note right of core: Execute template fn
  Note over template,core: Same as ngt-mesh <br>core will have THREE.BoxGeometry instance at ngt-box-geometry
```

</v-click>

---

# Flow: Simple (cont.)

```angular-html {all|1,2,4}
<ngt-mesh>
  <ngt-box-geometry />
  <ngt-mesh-basic-material />
</ngt-mesh>
```

<v-click>

```mermaid
sequenceDiagram;
  participant template
  participant renderer
  participant core
  core->>template: Here's THREE.Mesh and THREE.BoxGeometry
  template->>renderer: Here's the relationship between <br>ngt-mesh and ngt-box-geometry
  renderer->renderer: Call appendChild(Mesh, BoxGeometry)
  Note over renderer: Rely on THREE.js API to handle this relationship
```

</v-click>

---

# Flow: Simple (cont.)

<v-click>

```mermaid
---
title: Scene Graph
---
flowchart LR
    Scene -- parent of --> Mesh
    Mesh -- has --> BoxGeometry
    Mesh -- has --> MeshBasicMaterial
```

</v-click>

---

# Flow: Simple (cont.)

<v-click>

```mermaid
---
title: Scene Graph
---
flowchart LR
    Scene -- parent of --> Mesh1
    Scene -- parent of --> Mesh2
    Mesh1 -- has --> BoxGeometry
    Mesh1 -- has --> MeshBasicMaterial
    Mesh2 -- has --> CylinderGeometry
    Mesh2 -- has --> MeshStandardMaterial
    Mesh2 -- parent of --> Mesh3
    Mesh3 -- has --> PlaneGeometry
```

</v-click>

---

# Flow: Simple (cont.)

<div v-click class="h-full flex items-center">

```angular-html
<ngt-mesh name="Mesh1">
  <ngt-box-geometry />
  <ngt-mesh-basic-material />
</ngt-mesh>

<ngt-mesh name="Mesh2">
  <ngt-cylinder-geometry />
  <ngt-mesh-standard-material />

  <ngt-mesh name="Mesh3">
    <ngt-plane-geometry />
  </ngt-mesh>
</ngt-mesh>
```

</div>

---

# Internal Entities

<v-click>

````md magic-move
```angular-ts
@Component({
    template: `
        <ngt-mesh>
            <!-- ... -->
        </ngt-mesh>
    `
})
export class Scene {}
```

```angular-ts
@Component({
    template: `
        <ngt-mesh #mesh>
            <!-- ... -->
        </ngt-mesh>
    `
})
export class Scene {}
```

```angular-ts
@Component({
    template: `
        <ngt-mesh #mesh>
            <!-- ... -->
        </ngt-mesh>
    `
})
export class Scene {
    mesh = viewChild.required<ElementRef<Mesh>>("mesh");
}
```

```angular-ts
@Component({
    template: `
        <ngt-mesh #mesh>
            <!-- ... -->
        </ngt-mesh>
    `
})
export class Scene {
    mesh = viewChild.required<ElementRef<Mesh>>("mesh");

    constructor() {
        injectBeforeRender(() => {
            const mesh = this.mesh().nativeElement;
            //      ^? Mesh
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
        })
    }
}
```
````

</v-click>

---

# Structural Directive

````md magic-move
```angular-html
<ngt-box-geometry *args="[2, 2, 2]" />
```

```angular-html
<ng-template [args]="[2, 2, 2]">
    <ngt-box-geometry />
</ng-template>
```

```angular-html
<!-- comment: container -->
    <!-- BoxGeometry -->
```
````

---

# Structural Directive (cont.)

```mermaid
sequenceDiagram
    participant template
    participant renderer
    participant core
    Note right of core: Execute template fn
    core->>renderer: create a comment with "container" as the value
    renderer->renderer: call createComment("container")
    Note over renderer: internally keep track of this Comment node
```

---

# Structural Directive (cont.)

```mermaid
sequenceDiagram
    participant template
    participant renderer
    participant core
    Note over template,core: ...
    template->>renderer: handle ngt-box-geometry
    Note over renderer: check the tracked Comment nodes for _potential_ `NgtArgs` instance
    renderer->renderer: create `BoxGeometry(...argsValues)`
    renderer->>core: BoxGeometry with [2, 2, 2] instance
```

---

# Structural Directive (cont.)

<br>
<br>

<v-click>

`NgtArgs` is a Structure Directive so

</v-click>

<v-click>

`ViewContainerRef` and `TemplateRef` business to create and destroy the template

</v-click>

---

<div class="h-full flex justify-center items-center">

# Thank you

</div>

<PoweredBySlidev />
