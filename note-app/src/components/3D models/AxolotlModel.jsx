import React from 'react';
import { useGLTF } from '@react-three/drei';

export function AxolotlModel(props) {
  const { scene } = useGLTF('/axolotl/scene.glb');
  return <primitive object={scene} {...props} />;
}