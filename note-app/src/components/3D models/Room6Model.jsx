import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room6Model(props) {
  const { scene } = useGLTF('/room6/scene.glb');
  return <primitive object={scene} {...props} />;
}