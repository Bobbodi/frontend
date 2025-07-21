import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room2Model(props) {
  const { scene } = useGLTF('/room2/scene.glb');
  return <primitive object={scene} {...props} />;
}