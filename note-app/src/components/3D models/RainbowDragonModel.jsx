import React from 'react';
import { useGLTF } from '@react-three/drei';

export function RainbowDragonModel(props) {
  const { scene } = useGLTF('/rainbow_dragon/scene.glb');
  return <primitive object={scene} {...props} />;
}