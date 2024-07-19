import React, { useRef, useEffect } from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import { View } from 'react-native';

export default function SimpleSceneWithCube() {
  const glView = useRef<GLView>(null);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();

    // Dunkleren Hintergrund setzen
    scene.background = new THREE.Color(0x2d2d2d); // Dunkelgrau

    // Spotlight hinzufügen
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(5, 5, 5);
    scene.add(spotLight);

    // Würfel erstellen
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Grün
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Kamera hinzufügen
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      // Würfel rotieren lassen
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        ref={glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}