import React from 'react';
import { useGLTF } from '@react-three/drei';

export function SteveModel(props) {
  const { scene } = useGLTF('/steve/scene.glb');
  return <primitive object={scene} {...props} />;
}