import React from 'react';
import { useGLTF } from '@react-three/drei';

export function CentaurModel(props) {
  const { scene } = useGLTF('/centaur/scene.glb');
  return <primitive object={scene} {...props} />;
}