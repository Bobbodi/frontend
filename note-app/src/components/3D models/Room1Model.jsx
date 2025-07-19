import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Room1Model(props) {
  const { scene } = useGLTF('/room/room1.glb');
  return <primitive object={scene} {...props} />;
}