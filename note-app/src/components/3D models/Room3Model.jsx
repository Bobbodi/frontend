import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room3Model(props) {
  const { scene } = useGLTF('/room3/scene.glb');
  return <primitive object={scene} {...props} />;
}