import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room7Model(props) {
  const { scene } = useGLTF('/room7/scene.glb');
  return <primitive object={scene} {...props} />;
}