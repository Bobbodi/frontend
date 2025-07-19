import React from 'react';
import { useGLTF } from '@react-three/drei';

export function PigmanModel(props) {
  const { scene } = useGLTF('/pigman/scene.glb');
  return <primitive object={scene} {...props} />;
}