import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room5Model(props) {
  const { scene } = useGLTF('/room5/scene.glb');
  return <primitive object={scene} {...props} />;
}