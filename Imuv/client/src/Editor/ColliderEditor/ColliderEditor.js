import './ColliderEditor.css';

import { THREE } from 'ud-viz/src/Game/Shared/Shared';

export class ColliderEditorView {
  constructor(parentWEV) {
    this.parentWEV = parentWEV;

    this.editor = parentWEV.parentEV;

    this.model = new ColliderEditorModel();

    //raycaster
    this.raycaster = new THREE.Raycaster();

    this.rootHtml = this.parentWEV.rootHtml;

    this.canvas = this.parentWEV.parentEV.currentGameView.rootItownsHtml;

    //where html goes
    this.ui = document.createElement('div');
    this.ui.classList.add('ui_Editor');
    this.ui.classList.add('ui_ColliderEditor');
    this.rootHtml.appendChild(this.ui);

    this.labelColliderTool = null;
    this.uiCurrentShape = null;
    this.uiShapes = null;
    this.uiMode = null;

    this.closeButton = null;
    this.newButton = null;

    this.initUI();
    this.initCallbacks();
  }

  disposeUI() {
    this.ui.remove();
  }

  disposeCallbacks() {
    this.setOrbitsControl(true);
    window.onkeydown = null;
  }

  dispose() {
    this.disposeUI();
    this.disposeCallbacks();
  }

  setOrbitsControl(value) {
    this.editor.orbitControls.enabled = value;
  }

  updateUI() {
    this.uiShapes.innerHTML =
      'Shapes length : ' + this.model.getShapes().length;

    this.uiCurrentShape.innerHTML =
      'Current Shape : ' + this.model.getCurrentShape();

    if (this.editor.orbitControls.enabled) {
      this.uiMode.innerHTML = 'Mode : OrbitsControl';
    } else {
      this.uiMode.innerHTML = 'Mode : AddPoints';
    }
  }

  initUI() {
    const labelColliderTool = document.createElement('p');
    labelColliderTool.innerHTML =
      'Collider Tool <br>' + this.parentWEV.labelCurrentWorld.innerHTML;
    this.ui.appendChild(labelColliderTool);
    this.labelColliderTool = labelColliderTool;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    this.ui.appendChild(closeButton);
    this.closeButton = closeButton;

    const wrapper = document.createElement('div');
    const newButton = document.createElement('button');
    newButton.innerHTML = 'New';
    wrapper.appendChild(newButton);
    this.ui.appendChild(wrapper);
    this.newButton = newButton;

    const uiCurrentShape = document.createElement('p');
    uiCurrentShape.innerHTML = 'Current Shape : None';
    wrapper.appendChild(uiCurrentShape);
    this.ui.appendChild(wrapper);
    this.uiCurrentShape = uiCurrentShape;

    const uiShapes = document.createElement('p');
    uiShapes.innerHTML = 'Shapes length : None';
    wrapper.appendChild(uiShapes);
    this.ui.appendChild(wrapper);
    this.uiShapes = uiShapes;

    const uiMode = document.createElement('p');
    uiMode.innerHTML = 'Mode : OrbitsControl';
    wrapper.appendChild(uiMode);
    this.ui.appendChild(wrapper);
    this.uiMode = uiMode;
  }

  initCallbacks() {
    const _this = this;
    const currentGameView = _this.parentWEV.parentEV.currentGameView;
    const canvas = _this.canvas;

    const throwRay = function (event) {
      //1. sets the mouse position with a coordinate system where the center of the screen is the origin
      const mouse = new THREE.Vector2(
        -1 + (2 * event.offsetX) / canvas.clientWidth,
        1 - (2 * event.offsetY) / canvas.clientHeight
      );

      //2. set the picking ray from the camera position and mouse coordinates
      const camera = currentGameView.getItownsView().camera.camera3D;
      const oldNear = camera.near;
      camera.near = 0;
      _this.raycaster.setFromCamera(mouse, camera);
      camera.near = oldNear;

      //3. compute intersections
      const intersects = _this.raycaster.intersectObject(
        currentGameView.getObject3D(),
        true
      );

      return intersects[0];
    };

    this.newButton.onclick = function () {
      _this.model.setCurrentShape(new Sphape());
      _this.updateUI();
    };

    const editor = _this.editor;
    window.onkeydown = function (event) {
      if (event.defaultPrevented) return;
      if (event.code == 'Enter') {
        if (!_this.model.getCurrentShape()) return;
        console.log('Confirm Shape', _this.model.getCurrentShape());
        _this.model.addCurrentShape();
        canvas.onclick = null;
        _this.setOrbitsControl(true);
      }
      if (event.code == 'KeyQ') {
        const shape = _this.model.getCurrentShape();
        if (!shape) return;

        const mode = !editor.orbitControls.enabled;
        _this.setOrbitsControl(mode);
        if (!mode) {
          canvas.onclick = function (event) {
            if (event.button != 0) return;
            const intersect = throwRay(event);
            if (intersect) {
              const geometry = new THREE.SphereGeometry(1, 32, 32);
              const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
              const sphere = new THREE.Mesh(geometry, material);
              const pos = intersect.point;
              sphere.position.set(pos.x, pos.y, pos.z);
              _this.getScene(intersect.object).add(sphere);
              sphere.updateMatrix();
              shape.addPoint(sphere);
            }
          };
        } else {
          canvas.onclick = null;
        }
      }

      _this.updateUI();
    };
  }

  setOnClose(f) {
    this.closeButton.onclick = f;
  }

  getScene(obj) {
    if (obj.parent) return this.getScene(obj.parent);
    return obj;
  }
}

export class ColliderEditorModel {
  constructor() {
    this.shapes = [];
    this.currentShape = null;
  }

  addCurrentShape() {
    if (!this.currentShape || !this.currentShape.points.length) {
      console.log('BAD DATA ! CurrentShape : ', this.currentShape);
      return;
    }
    this.shapes.push(this.currentShape);
    this.setCurrentShape(null);
  }

  setCurrentShape(shape) {
    this.currentShape = shape;
  }

  getCurrentShape() {
    return this.currentShape;
  }

  getShapes() {
    return this.shapes;
  }
}

export class Sphape {
  constructor() {
    this.points = [];

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = null;
  }

  addPoint(point) {
    this.points.push(point);
    this.updateMesh();
  }

  updateMesh() {
    const points = this.points;
    if (!points.length) return;
    const vertices = new Float32Array(points.length * 3);
    for (let i = 0; i < this.points.length; i++) {
      vertices[3 * i] = points[i].position.x;
      vertices[3 * i + 1] = points[i].position.y;
      vertices[3 * i + 2] = points[i].position.z;
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    points[0].parent.add(this.mesh);
    this.mesh.side = THREE.DoubleSide;
    this.mesh.updateMatrix();
  }
}
