import React from 'react';
import { useGLTF } from '@react-three/drei';

export function CowModel(props) {
  const { scene } = useGLTF('/cow/scene.glb');
  return <primitive object={scene} {...props} />;
}