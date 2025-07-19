import React from 'react';
import { useGLTF } from '@react-three/drei';

export function CamelModel(props) {
  const { scene } = useGLTF('/camel/scene.glb');
  return <primitive object={scene} {...props} />;
}