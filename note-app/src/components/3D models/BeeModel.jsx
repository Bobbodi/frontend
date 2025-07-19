import React from 'react';
import { useGLTF } from '@react-three/drei';

export function BeeModel(props) {
  const { scene } = useGLTF('/bee/scene.glb');
  return <primitive object={scene} {...props} />;
}