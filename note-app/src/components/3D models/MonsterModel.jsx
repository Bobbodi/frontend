import React from 'react';
import { useGLTF } from '@react-three/drei';

export function MonsterModel(props) {
  const { scene } = useGLTF('/monster/scene.glb');
  return <primitive object={scene} {...props} />;
}