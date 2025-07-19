import React from 'react';
import { useGLTF } from '@react-three/drei';

export function DogModel(props) {
  const { scene } = useGLTF('/dog/dog.glb');
  return <primitive object={scene} {...props} />;
}