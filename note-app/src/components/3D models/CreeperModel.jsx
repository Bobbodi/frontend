import React from 'react';
import { useGLTF } from '@react-three/drei';

export function CreeperModel(props) {
  const { scene } = useGLTF('/creeper/scene.glb');
  return <primitive object={scene} {...props} />;
}