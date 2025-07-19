import React from 'react';
import { useGLTF } from '@react-three/drei';

export function SharkModel(props) {
  const { scene } = useGLTF('/shark/scene.glb');
  return <primitive object={scene} {...props} />;
}