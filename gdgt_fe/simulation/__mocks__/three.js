// Mock for 'three' — prevents WebGL errors in test environment
export const Vector3 = class { set() {} }
export const Quaternion = class { set() {} }
export const Color = class { set() { return this } }
export const Euler = class {}
export const Matrix4 = class {}
export const Mesh = class {}
export const MeshStandardMaterial = class {}
export const BoxGeometry = class {}
export const PlaneGeometry = class {}
export const CylinderGeometry = class {}
export const CircleGeometry = class {}
export const Group = class {}
export const DirectionalLight = class {}
export const AmbientLight = class {}
export const WebGLRenderer = class {
  setSize() {}
  setPixelRatio() {}
  render() {}
  dispose() {}
  get domElement() { return document.createElement('canvas') }
}
export const Scene = class {}
export const PerspectiveCamera = class {
  updateProjectionMatrix() {}
}
export const Clock = class { getDelta() { return 0.016 } }
export const MathUtils = { degToRad: (v) => v, clamp: (v) => v }
export default {
  Vector3, Quaternion, Color, Euler, Matrix4,
  Mesh, MeshStandardMaterial, BoxGeometry, PlaneGeometry,
  CylinderGeometry, CircleGeometry, Group,
  DirectionalLight, AmbientLight, WebGLRenderer, Scene,
  PerspectiveCamera, Clock, MathUtils,
}
