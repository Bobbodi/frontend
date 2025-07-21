import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room4Model(props) {
  const { scene } = useGLTF('/room4/scene.glb');
  return <primitive object={scene} {...props} />;
}