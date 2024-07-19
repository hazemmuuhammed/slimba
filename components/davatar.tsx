import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber/native';
import Trigger from '@/components/Trigger';
import Loader from '@/components/Loader';
import { Lion } from '@/components/Lion';
import theme from '../hooks/theme';

const Davatar = ({ onLoad, style }: { onLoad?: () => void, style?: any }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && onLoad) {
      onLoad();
    }
  }, [loading, onLoad]);

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.overlay}>
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      )}
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
      >
        <View style={styles.modelContainer}>
          <Canvas
            shadows
            onCreated={(state) => {
              const _gl = state.gl.getContext();
              const pixelStorei = _gl.pixelStorei.bind(_gl);
              _gl.pixelStorei = function (...args) {
                const [parameter] = args;
                switch (parameter) {
                  case _gl.UNPACK_FLIP_Y_WEBGL:
                    return pixelStorei(...args);
                }
              };

              state.camera.position.set(0, 1.2, 5);
              state.camera.lookAt(0, 0, 0);
            }}
          >
            <ambientLight intensity={0.8} /> {/* Soft overall lighting */}
            <directionalLight 
              position={[5, 10, 5]} 
              intensity={2.2} 
              castShadow 
              shadow-mapSize-width={1024} 
              shadow-mapSize-height={1024}
              shadow-camera-far={50} 
              shadow-camera-left={-10} 
              shadow-camera-right={10} 
              shadow-camera-top={10} 
              shadow-camera-bottom={-10}
            />
            
            <Suspense fallback={<Trigger setLoading={setLoading} />}>
              <Lion 
                scale={[1, 1, 1]} 
                position={[0, -2, -2]} 
                castShadow
                receiveShadow
              />
            </Suspense>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
              <planeGeometry args={[40, 5]} />
              <meshStandardMaterial color="#FBCB91" /> {/* Dark brown color */}
            </mesh>
          </Canvas>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Davatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryGreen100, // Primary green color from theme
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure overlay is above other content
  },
  loadingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  modelContainer: {
    flex: 1,
  },
});
