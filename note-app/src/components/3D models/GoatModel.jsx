import React from 'react';
import { useGLTF } from '@react-three/drei';

export function GoatModel(props) {
  const { scene } = useGLTF('/goat/scene.glb');
  return <primitive object={scene} {...props} />;
}