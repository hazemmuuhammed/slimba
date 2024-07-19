import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import useStore from './store';

// Definiere das Interface für die möglichen Aktionen
interface Actions {
  "Idle Animation"?: THREE.AnimationAction;
  "Smile"?: THREE.AnimationAction;
  "Dance"?: THREE.AnimationAction;
  "Disappointed"?: THREE.AnimationAction;
}

type ActionName =
  | "All Combined"
  | "Dance"
  | "Disappointed"
  | "Idle Animation"
  | "Smile";

export function Lion(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    require("../assets/models/Lion.glb")
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group) as { actions: Actions };

  const totalPoints = useStore(state => state.totalPoints);
  const [previousPoints, setPreviousPoints] = useState(totalPoints);
  const perfectDay = useStore(state => state.perfectDay); // Assuming perfectDay is a boolean in your store

  // Initialisiere und starte die Smile Animation, dann wechsle zur Idle Animation
  useEffect(() => {
    if (actions["Smile"] && actions["Idle Animation"]) {
      console.log("Initialisiere und starte die Smile Animation");

      // Spiele die Smile Animation ab
      actions["Smile"].reset().play();
      actions["Smile"].clampWhenFinished = true;
      actions["Smile"].loop = THREE.LoopOnce;

      const mixer = actions["Smile"].getMixer();
      if (mixer) {
        const onFinished = () => {
          console.log("Smile Animation ist beendet, Idle Animation wird gestartet");
          actions["Idle Animation"]!.reset().play();
          mixer.removeEventListener('finished', onFinished);
        };
        mixer.addEventListener('finished', onFinished);
      }
    }
  }, [actions]);

  useEffect(() => {
    // Effekt, der auf Änderungen von totalPoints reagiert
    console.log(`totalPoints hat sich geändert: ${totalPoints}`);
    const pointsDifference = totalPoints - previousPoints;

    const stopAllActions = () => {
      for (const actionName in actions) {
        const action = actions[actionName as keyof Actions];
        if (action) {
          action.stop();
        }
      }
    };

    const startIdleAnimation = () => {
      if (actions["Idle Animation"]) {
        console.log("Idle Animation wird neu gestartet");
        actions["Idle Animation"].reset().fadeIn(0.5).play();
      }
    };

    if (perfectDay) { // Wenn es ein Perfect Day ist, spiele "Dance" ab
      console.log("Perfect Day, Dance Animation wird gestartet");

      stopAllActions();

      if (actions["Dance"]) {
        console.log("Dance Animation wird zurückgesetzt und gestartet");
        actions["Dance"].reset().fadeIn(0.5).play();
  
        // Setze die Animationseigenschaften, um sie einmal abzuspielen
        actions["Dance"].clampWhenFinished = true;
        actions["Dance"].loop = THREE.LoopOnce;

        // Verwende AnimationMixer statt addEventListener
        const mixer = actions["Dance"].getMixer();
        if (mixer && actions["Dance"]) {
          console.log("Event-Listener für das Ende der Dance Animation wird hinzugefügt");
          
          // Berechne die Zeit, die die Animation laufen soll (eine Sekunde weniger als ihre Dauer)
          const duration = actions["Dance"].getClip().duration;
          const endTime = duration - 5; // Eine Sekunde vor Ende

          const onFinished = () => {
            console.log("Dance Animation ist beendet, Idle Animation wird neu gestartet");
            startIdleAnimation();
            mixer.removeEventListener('finished', onFinished);
          };

          // Füge den Event-Listener hinzu, um die Animation eine Sekunde vor dem Ende zu stoppen
          setTimeout(() => {
            if (actions["Dance"]) {
              actions["Dance"].stop();
              onFinished();
            }
          }, endTime * 1000);

          mixer.addEventListener('finished', onFinished);
        }
      }
    } else if (pointsDifference > 30) { // Wenn die Punkte um mehr als 30 gestiegen sind, spiele "Dance" ab
      console.log("Punkte sind um mehr als 30 gestiegen, Dance Animation wird gestartet");

      stopAllActions();

      if (actions["Dance"]) {
        console.log("Dance Animation wird zurückgesetzt und gestartet");
        actions["Dance"].reset().fadeIn(0.5).play();
  
        // Setze die Animationseigenschaften, um sie einmal abzuspielen
        actions["Dance"].clampWhenFinished = true;
        actions["Dance"].loop = THREE.LoopOnce;

        // Verwende AnimationMixer statt addEventListener
        const mixer = actions["Dance"].getMixer();
        if (mixer && actions["Dance"]) {
          console.log("Event-Listener für das Ende der Dance Animation wird hinzugefügt");
          
          // Berechne die Zeit, die die Animation laufen soll (eine Sekunde weniger als ihre Dauer)
          const duration = actions["Dance"].getClip().duration;
          const endTime = duration - 5; // Eine Sekunde vor Ende

          const onFinished = () => {
            console.log("Dance Animation ist beendet, Idle Animation wird neu gestartet");
            startIdleAnimation();
            mixer.removeEventListener('finished', onFinished);
          };

          // Füge den Event-Listener hinzu, um die Animation eine Sekunde vor dem Ende zu stoppen
          setTimeout(() => {
            if (actions["Dance"]) {
              actions["Dance"].stop();
              onFinished();
            }
          }, endTime * 1000);

          mixer.addEventListener('finished', onFinished);
        }
      }
    } else if (pointsDifference > 0) { // Wenn die Punkte gestiegen sind, aber weniger als 30, spiele "Smile" ab
      console.log("totalPoints ist größer als 0, Smile Animation wird gestartet");

      stopAllActions();

      if (actions["Smile"]) {
        console.log("Smile Animation wird zurückgesetzt und gestartet");
        actions["Smile"].reset().fadeIn(0.5).play();

        // Setze die Animationseigenschaften, um sie einmal abzuspielen
        actions["Smile"].clampWhenFinished = true;
        actions["Smile"].loop = THREE.LoopOnce;

        // Verwende AnimationMixer statt addEventListener
        const mixer = actions["Smile"].getMixer();
        if (mixer) {
          console.log("Event-Listener für das Ende der Smile Animation wird hinzugefügt");
          const onFinished = () => {
            console.log("Smile Animation ist beendet, Idle Animation wird neu gestartet");
            startIdleAnimation();
            mixer.removeEventListener('finished', onFinished);
          };
          mixer.addEventListener('finished', onFinished);
        }
      }
    } else if (pointsDifference < 0) { // Wenn die Punkte gesunken sind, spiele "Disappointed" ab
      console.log("totalPoints ist gesunken, Disappointed Animation wird gestartet");

      stopAllActions();

      if (actions["Disappointed"]) {
        console.log("Disappointed Animation wird zurückgesetzt und gestartet");
        actions["Disappointed"].reset().fadeIn(0.5).play();

        // Setze die Animationseigenschaften, um sie einmal abzuspielen
        actions["Disappointed"].clampWhenFinished = true;
        actions["Disappointed"].loop = THREE.LoopOnce;

        // Verwende AnimationMixer statt addEventListener
        const mixer = actions["Disappointed"].getMixer();
        if (mixer) {
          console.log("Event-Listener für das Ende der Disappointed Animation wird hinzugefügt");
          const onFinished = () => {
            console.log("Disappointed Animation ist beendet, Idle Animation wird neu gestartet");
            startIdleAnimation();
            mixer.removeEventListener('finished', onFinished);
          };
          mixer.addEventListener('finished', onFinished);
        }
      }
    }

    // Aktualisiere den vorherigen Punktestand
    setPreviousPoints(totalPoints);
  }, [totalPoints, actions, perfectDay]);
  return (

      <group
      ref={group}
      {...props}
      dispose={null}
      scale={1.3}
      position={[0, -3, 0]}
    >
      <group name="Scene">
        <group name="RIG_(ANIMATION_ALL_COMBINED)">
          <group name="body001">
            <skinnedMesh
              name="Cube016"
              geometry={nodes.Cube016.geometry}
              material={materials['orange fur.003']}
              skeleton={nodes.Cube016.skeleton}
            />
            <skinnedMesh
              name="Cube016_1"
              geometry={nodes.Cube016_1.geometry}
              material={materials['white fur.003']}
              skeleton={nodes.Cube016_1.skeleton}
            />
          </group>
          <skinnedMesh
            name="Cube001"
            geometry={nodes.Cube001.geometry}
            material={materials['tongue.003']}
            skeleton={nodes.Cube001.skeleton}
          />
          <group name="ears001">
            <skinnedMesh
              name="Torus003"
              geometry={nodes.Torus003.geometry}
              material={materials['orange fur.003']}
              skeleton={nodes.Torus003.skeleton}
            />
            <skinnedMesh
              name="Torus003_1"
              geometry={nodes.Torus003_1.geometry}
              material={materials['pink.003']}
              skeleton={nodes.Torus003_1.skeleton}
            />
          </group>
          <skinnedMesh
            name="eyebrows001"
            geometry={nodes.eyebrows001.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.eyebrows001.skeleton}
          />
          <skinnedMesh
            name="feet001"
            geometry={nodes.feet001.geometry}
            material={materials['white fur.003']}
            skeleton={nodes.feet001.skeleton}
          />
          <skinnedMesh
            name="legs001"
            geometry={nodes.legs001.geometry}
            material={materials['orange fur.003']}
            skeleton={nodes.legs001.skeleton}
          />
          <skinnedMesh
            name="new_eyelashes001"
            geometry={nodes.new_eyelashes001.geometry}
            material={materials['black.003']}
            skeleton={nodes.new_eyelashes001.skeleton}
            morphTargetDictionary={nodes.new_eyelashes001.morphTargetDictionary}
            morphTargetInfluences={nodes.new_eyelashes001.morphTargetInfluences}
          />
          <skinnedMesh
            name="NurbsPath006"
            geometry={nodes.NurbsPath006.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath006.skeleton}
          />
          <skinnedMesh
            name="NurbsPath010"
            geometry={nodes.NurbsPath010.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath010.skeleton}
          />
          <skinnedMesh
            name="NurbsPath011"
            geometry={nodes.NurbsPath011.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath011.skeleton}
          />
          <skinnedMesh
            name="NurbsPath013"
            geometry={nodes.NurbsPath013.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath013.skeleton}
          />
          <skinnedMesh
            name="NurbsPath014"
            geometry={nodes.NurbsPath014.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath014.skeleton}
          />
          <skinnedMesh
            name="NurbsPath015"
            geometry={nodes.NurbsPath015.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath015.skeleton}
          />
          <skinnedMesh
            name="NurbsPath016"
            geometry={nodes.NurbsPath016.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath016.skeleton}
          />
          <skinnedMesh
            name="NurbsPath019"
            geometry={nodes.NurbsPath019.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath019.skeleton}
          />
          <skinnedMesh
            name="NurbsPath020"
            geometry={nodes.NurbsPath020.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath020.skeleton}
          />
          <skinnedMesh
            name="NurbsPath021"
            geometry={nodes.NurbsPath021.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath021.skeleton}
          />
          <skinnedMesh
            name="NurbsPath022"
            geometry={nodes.NurbsPath022.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath022.skeleton}
          />
          <skinnedMesh
            name="NurbsPath023"
            geometry={nodes.NurbsPath023.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath023.skeleton}
          />
          <skinnedMesh
            name="NurbsPath024"
            geometry={nodes.NurbsPath024.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath024.skeleton}
          />
          <skinnedMesh
            name="NurbsPath025"
            geometry={nodes.NurbsPath025.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath025.skeleton}
          />
          <skinnedMesh
            name="NurbsPath026"
            geometry={nodes.NurbsPath026.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath026.skeleton}
          />
          <skinnedMesh
            name="NurbsPath027"
            geometry={nodes.NurbsPath027.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath027.skeleton}
          />
          <skinnedMesh
            name="NurbsPath032"
            geometry={nodes.NurbsPath032.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath032.skeleton}
          />
          <skinnedMesh
            name="NurbsPath127"
            geometry={nodes.NurbsPath127.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath127.skeleton}
          />
          <skinnedMesh
            name="NurbsPath128"
            geometry={nodes.NurbsPath128.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.NurbsPath128.skeleton}
          />
          <skinnedMesh
            name="Plane001"
            geometry={nodes.Plane001.geometry}
            material={materials['pink.003']}
            skeleton={nodes.Plane001.skeleton}
          />
          <group name="Retopo_head001">
            <skinnedMesh
              name="mesh004"
              geometry={nodes.mesh004.geometry}
              material={materials['orange fur.003']}
              skeleton={nodes.mesh004.skeleton}
              morphTargetDictionary={nodes.mesh004.morphTargetDictionary}
              morphTargetInfluences={nodes.mesh004.morphTargetInfluences}
            />
            <skinnedMesh
              name="mesh004_1"
              geometry={nodes.mesh004_1.geometry}
              material={materials['white fur.003']}
              skeleton={nodes.mesh004_1.skeleton}
              morphTargetDictionary={nodes.mesh004_1.morphTargetDictionary}
              morphTargetInfluences={nodes.mesh004_1.morphTargetInfluences}
            />
            <skinnedMesh
              name="mesh004_2"
              geometry={nodes.mesh004_2.geometry}
              material={materials['Material.003']}
              skeleton={nodes.mesh004_2.skeleton}
              morphTargetDictionary={nodes.mesh004_2.morphTargetDictionary}
              morphTargetInfluences={nodes.mesh004_2.morphTargetInfluences}
            />
          </group>
          <skinnedMesh
            name="Sphere003"
            geometry={nodes.Sphere003.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere003.skeleton}
          />
          <skinnedMesh
            name="Sphere010"
            geometry={nodes.Sphere010.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere010.skeleton}
          />
          <skinnedMesh
            name="Sphere012"
            geometry={nodes.Sphere012.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere012.skeleton}
          />
          <skinnedMesh
            name="Sphere013"
            geometry={nodes.Sphere013.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere013.skeleton}
          />
          <skinnedMesh
            name="Sphere014"
            geometry={nodes.Sphere014.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere014.skeleton}
          />
          <skinnedMesh
            name="Sphere015"
            geometry={nodes.Sphere015.geometry}
            material={materials['black.003']}
            skeleton={nodes.Sphere015.skeleton}
          />
          <skinnedMesh
            name="Sphere016"
            geometry={nodes.Sphere016.geometry}
            material={materials['white teeth.003']}
            skeleton={nodes.Sphere016.skeleton}
          />
          <skinnedMesh
            name="Sphere017"
            geometry={nodes.Sphere017.geometry}
            material={materials['white teeth.003']}
            skeleton={nodes.Sphere017.skeleton}
          />
          <skinnedMesh
            name="tail_fur001"
            geometry={nodes.tail_fur001.geometry}
            material={materials['dark brown.003']}
            skeleton={nodes.tail_fur001.skeleton}
          />
          <skinnedMesh
            name="tail001"
            geometry={nodes.tail001.geometry}
            material={materials['orange fur.003']}
            skeleton={nodes.tail001.skeleton}
          />
          <skinnedMesh
            name="whiskers1001"
            geometry={nodes.whiskers1001.geometry}
            material={materials['white fur.003']}
            skeleton={nodes.whiskers1001.skeleton}
          />
          <skinnedMesh
            name="whiskers2001"
            geometry={nodes.whiskers2001.geometry}
            material={materials['white fur.003']}
            skeleton={nodes.whiskers2001.skeleton}
          />
          <skinnedMesh
            name="whiskers3001"
            geometry={nodes.whiskers3001.geometry}
            material={materials['white fur.003']}
            skeleton={nodes.whiskers3001.skeleton}
          />
          <primitive object={nodes.root} />
          <primitive object={nodes['MCH-torsoparent']} />
          <primitive object={nodes['MCH-hand_ikparentL']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
          <primitive object={nodes['MCH-hand_ikparentR']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
          <primitive object={nodes['MCH-eye_commonparent']} />
          <primitive object={nodes['MCH-foot_ikparentL']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
          <primitive object={nodes['MCH-foot_ikparentR']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
          <primitive object={nodes['MCH-lip_armBL001']} />
          <primitive object={nodes['MCH-lip_armBR001']} />
          <primitive object={nodes['MCH-lip_armTL001']} />
          <primitive object={nodes['MCH-lip_armTR001']} />
        </group>
      </group>
    </group>
  )
}

type GLTFResult = GLTF & {
  nodes: {
    Cube016: THREE.SkinnedMesh
    Cube016_1: THREE.SkinnedMesh
    Cube001: THREE.SkinnedMesh
    Torus003: THREE.SkinnedMesh
    Torus003_1: THREE.SkinnedMesh
    eyebrows001: THREE.SkinnedMesh
    feet001: THREE.SkinnedMesh
    legs001: THREE.SkinnedMesh
    new_eyelashes001: THREE.SkinnedMesh
    NurbsPath006: THREE.SkinnedMesh
    NurbsPath010: THREE.SkinnedMesh
    NurbsPath011: THREE.SkinnedMesh
    NurbsPath013: THREE.SkinnedMesh
    NurbsPath014: THREE.SkinnedMesh
    NurbsPath015: THREE.SkinnedMesh
    NurbsPath016: THREE.SkinnedMesh
    NurbsPath019: THREE.SkinnedMesh
    NurbsPath020: THREE.SkinnedMesh
    NurbsPath021: THREE.SkinnedMesh
    NurbsPath022: THREE.SkinnedMesh
    NurbsPath023: THREE.SkinnedMesh
    NurbsPath024: THREE.SkinnedMesh
    NurbsPath025: THREE.SkinnedMesh
    NurbsPath026: THREE.SkinnedMesh
    NurbsPath027: THREE.SkinnedMesh
    NurbsPath032: THREE.SkinnedMesh
    NurbsPath127: THREE.SkinnedMesh
    NurbsPath128: THREE.SkinnedMesh
    Plane001: THREE.SkinnedMesh
    mesh004: THREE.SkinnedMesh
    mesh004_1: THREE.SkinnedMesh
    mesh004_2: THREE.SkinnedMesh
    Sphere003: THREE.SkinnedMesh
    Sphere010: THREE.SkinnedMesh
    Sphere012: THREE.SkinnedMesh
    Sphere013: THREE.SkinnedMesh
    Sphere014: THREE.SkinnedMesh
    Sphere015: THREE.SkinnedMesh
    Sphere016: THREE.SkinnedMesh
    Sphere017: THREE.SkinnedMesh
    tail_fur001: THREE.SkinnedMesh
    tail001: THREE.SkinnedMesh
    whiskers1001: THREE.SkinnedMesh
    whiskers2001: THREE.SkinnedMesh
    whiskers3001: THREE.SkinnedMesh
    Sphere040: THREE.Mesh
    Sphere040_1: THREE.Mesh
    Sphere040_2: THREE.Mesh
    Sphere041: THREE.Mesh
    Sphere041_1: THREE.Mesh
    Sphere041_2: THREE.Mesh
    NurbsPath017: THREE.Mesh
    NurbsPath018: THREE.Mesh
    NurbsPath033: THREE.Mesh
    NurbsPath034: THREE.Mesh
    NurbsPath035: THREE.Mesh
    NurbsPath036: THREE.Mesh
    NurbsPath037: THREE.Mesh
    NurbsPath042: THREE.Mesh
    NurbsPath043: THREE.Mesh
    NurbsPath044: THREE.Mesh
    NurbsPath045: THREE.Mesh
    NurbsPath046: THREE.Mesh
    NurbsPath047: THREE.Mesh
    NurbsPath048: THREE.Mesh
    NurbsPath049: THREE.Mesh
    NurbsPath050: THREE.Mesh
    NurbsPath051: THREE.Mesh
    NurbsPath052: THREE.Mesh
    NurbsPath053: THREE.Mesh
    NurbsPath054: THREE.Mesh
    NurbsPath055: THREE.Mesh
    NurbsPath112: THREE.Mesh
    NurbsPath113: THREE.Mesh
    NurbsPath114: THREE.Mesh
    NurbsPath115: THREE.Mesh
    NurbsPath116: THREE.Mesh
    NurbsPath117: THREE.Mesh
    NurbsPath118: THREE.Mesh
    NurbsPath119: THREE.Mesh
    NurbsPath120: THREE.Mesh
    NurbsPath121: THREE.Mesh
    NurbsPath122: THREE.Mesh
    NurbsPath123: THREE.Mesh
    NurbsPath124: THREE.Mesh
    NurbsPath125: THREE.Mesh
    NurbsPath126: THREE.Mesh
    NurbsPath129: THREE.Mesh
    NurbsPath130: THREE.Mesh
    NurbsPath131: THREE.Mesh
    NurbsPath132: THREE.Mesh
    NurbsPath133: THREE.Mesh
    NurbsPath134: THREE.Mesh
    NurbsPath135: THREE.Mesh
    NurbsPath136: THREE.Mesh
    root: THREE.Bone;
    ["MCH-torsoparent"]: THREE.Bone;
    ["MCH-hand_ikparentL"]: THREE.Bone;
    ["MCH-upper_arm_ik_targetparentL"]: THREE.Bone;
    ["MCH-hand_ikparentR"]: THREE.Bone;
    ["MCH-upper_arm_ik_targetparentR"]: THREE.Bone;
    ["MCH-eye_commonparent"]: THREE.Bone;
    ["MCH-foot_ikparentL"]: THREE.Bone;
    ["MCH-thigh_ik_targetparentL"]: THREE.Bone;
    ["MCH-foot_ikparentR"]: THREE.Bone;
    ["MCH-thigh_ik_targetparentR"]: THREE.Bone;
    ["MCH-lip_armBL001"]: THREE.Bone;
    ["MCH-lip_armBR001"]: THREE.Bone;
    ["MCH-lip_armTL001"]: THREE.Bone;
    ["MCH-lip_armTR001"]: THREE.Bone;
  };
  materials: {
    ["orange fur.003"]: THREE.MeshStandardMaterial;
    ["white fur.003"]: THREE.MeshStandardMaterial;
    ["tongue.003"]: THREE.MeshStandardMaterial;
    ["pink.003"]: THREE.MeshStandardMaterial;
    ["dark brown.003"]: THREE.MeshStandardMaterial;
    ["black.003"]: THREE.MeshStandardMaterial;
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
    ["Material.007"]: THREE.MeshStandardMaterial;
    ["white teeth.003"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
    ["Material.001"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
  };
};

