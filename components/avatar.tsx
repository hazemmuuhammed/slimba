import { StyleSheet, View } from "react-native";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber/native";
import Trigger from "@/components/Trigger";
import Loader from "@/components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lion } from "@/components/Lion";

const Index = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modelContainer}>
        {loading && <Loader />}
        <Canvas
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
          }}
        >
          <directionalLight position={[1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[0, 0, 1]} args={["white", 2]} />
          <directionalLight position={[0, 0, -1]} args={["white", 2]} />
          <directionalLight position={[0, 1, 0]} args={["white", 2]} />
          <directionalLight position={[0, -1, 0]} args={["white", 2]} />
          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <Lion />
          </Suspense>
        </Canvas>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  modelContainer: {
    flex: 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textContainer: {
    margin: 20,
    marginBottom: 0,
  },
  textTitle: {
    fontSize: 28,
    color: "#051E47",
    fontWeight: "bold",
  },
  textPrice: {
    fontSize: 28,
    color: "#3F6900",
    fontWeight: "bold",
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "justify",
    marginVertical: 10,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3F6900",
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
