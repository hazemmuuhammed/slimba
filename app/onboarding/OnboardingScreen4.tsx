import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import theme from "../../hooks/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Reanimated, {
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
type Section = { subtitle?: string; text: string };

const OnboardingScreen4 = () => {
  const [step, setStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<any>();
  const content: { title: string; sections: Section[]; isFinal?: boolean }[] = [
    {
      title: "Willst du ein Geheimnis wissen? 🤫",
      sections: [
        {
          text: "Auch ich, war mal ein Löwe mit ein paar Extra-Kilos. Ja, du hast richtig gehört! Es gab eine Zeit, da war mein Bauch runder als meine Mähne fluffig war! 🦁🍩",
        },
        {
          text: "Aber dann habe ich beschlossen, etwas zu ändern. Mit viel Spaß und drei einfachen Regeln habe ich mein Wohlfühlgewicht erreicht. 💪✨",
        },
        {
          text: "Willst du wissen, welche Regeln das sind? Keine Sorge, ich werde sie dir später verraten. 😉 Bleib dran und lass uns zusammen diese Reise beginnen!",
        },
      ],
    },
    {
      title: "Wie unterstütze ich dich? 🦁📱",
      sections: [
        {
          subtitle: "Essen 🍽️",
          text: "Tracke, was du isst. Gesundes Essen gibt dir Punkte, ungesundes zieht Punkte ab. Du musst dabei nicht jede einzelne Kalorie berücksichtigen. Eine gesunde Essens-Struktur ist viel wichtiger.",
        },
        {
          subtitle: "Sport 🏃‍♀️",
          text: "Jede Aktivität zählt! Ob Laufen, Yoga oder Tanzen – alles bringt Punkte.",
        },
        {
          subtitle: "Challenges 🏆",
          text: "Schließe spannende Herausforderungen ab und sammle extra Punkte.",
        },
      ],
    },
    {
      title: "Level Up! 🚀",
      sections: [
        {
          text: "Alles, was du trackst, gibt dir Punkte oder zieht welche ab. Erreichst du bestimmte Punktestände, steigst du im Level auf. Je höher dein Level, desto mehr wirst du die positiven Veränderungen spüren und sehen!",
        },
        {
          subtitle: "Level 1 ⭐",
          text: "Wir fangen an! Du machst die ersten Schritte und lernst das Prinzip kennen.",
        },
        {
          subtitle: "Level 2 ⭐⭐",
          text: "Du fühlst dich insgesamt besser und energievoller.",
        },
        {
          subtitle: "Level 3-4 ⭐⭐⭐",
          text: "Du siehst schon erste Veränderungen an deinem Körper.",
        },
        {
          subtitle: "Level 5 ⭐⭐⭐⭐",
          text: "Dein Umfeld bemerkt deine Veränderung und du bekommst tolle Komplimente!",
        },
        {
          subtitle: "Level 6,7,8,... ⭐⭐⭐⭐⭐",
          text: "Werde zu deinem besten selbst!",
        },
      ],
    },
    {
      title: "Meine goldenen Regeln 🏅",
      sections: [
        {
          text: "Wie ich dir bereits versprochen habe, verrate ich dir nun meine drei goldenen Regeln, um dein Wohlsfühlgewicht zu erreichen:",
        },
        {
          subtitle: "1. Eine gesunde Essstruktur aufbauen 🍏",
          text: "Finde eine Essensroutine, die zu deinem Alltag passt. Es muss nicht kompliziert sein! Kleine, gesunde Gewohnheiten können Großes bewirken. Mit mir an deiner Seite wirst du lernen, wie du das Essen genießen und trotzdem gesund bleiben kannst.",
        },
        {
          subtitle: "2. Sei dir deiner Kalorien bewusst ⚖️",
          text: "Keine Sorge, du musst nicht jede einzelne Kalorie akribisch zählen! Es geht nicht darum, alles perfekt zu tracken. Fünf gerade sein zu lassen, ist völlig okay. Wichtig ist, dass du ein Gefühl dafür bekommst, wie viel du zu dir nimmst und eine gesunde Struktur und Regelmäßigkeit beibehältst. Mit mir wird es kinderleicht, den Überblick zu behalten und bewusste Entscheidungen zu treffen.",
        },
        {
          subtitle: "3. Dran bleiben und motiviert sein 💪",
          text: "Kontinuität ist der Schlüssel! Es wird Tage geben, an denen es schwerfällt, aber genau da komme ich ins Spiel. Ich unterstütze dich, motiviere dich und halte dich auf Kurs. Zusammen schaffen wir das!",
        },
        {
          subtitle: "Positive Veränderungen",
          text: "Wenn du diese Tipps befolgst, wirst du nicht nur dein Wohlfühlgewicht erreichen, sondern auch ein unglaubliches positives Gefühl erleben. Ein gesunder Lebensstil bringt so viel Positives in dein Leben – mehr Energie, bessere Laune und ein gesteigertes Selbstbewusstsein. Dein Umfeld wird die Veränderung sehen und du wirst stolz auf dich sein!",
        },
      ],
    },
    {
      title: "Bereit? 🚀",
      sections: [
        {
          text: "Ich bin hier, um dich zu unterstützen und sicherzustellen, dass du dich großartig fühlst! 🦁💚 Du wirst jeden Tag eine kleine Botschaft von mir erhalten. Einen Tipp oder sonst irgendetwas interessantes, dass dir dabei hilft, dran zu bleiben.",
        },
        {
          text: "Bist du bereit diese Reise mit mir in Angriff zu nehmen? Dann lass uns gemeinsam diesen Weg gehen.",
        },
      ],
      isFinal: true,
    },
  ];

  const handleNext = () => {
    if (step < content.length - 1) {
      setStep(step + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      navigation.navigate("Main");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step >= 0 && styles.activeDot]} />
          <View style={[styles.progressDot, step >= 1 && styles.activeDot]} />
          <View style={[styles.progressDot, step >= 2 && styles.activeDot]} />
          <View style={[styles.progressDot, step >= 3 && styles.activeDot]} />
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Reanimated.View
          key={`image-${step}`} // Ensure the component re-renders on step change
          entering={SlideInRight.duration(500)}
          exiting={SlideOutLeft.duration(500)}
          style={styles.imageContainer}
        >
          <Image
            source={require("../../assets/images/slimbavisualgym.jpg")}
            style={styles.image}
          />
        </Reanimated.View>
        <Reanimated.View
          key={`content-${step}`} // Ensure the component re-renders on step change
          entering={SlideInRight.duration(500)}
          exiting={SlideOutLeft.duration(500)}
          style={styles.contentContainer}
        >
          <Text style={styles.title}>{content[step].title}</Text>
          {content[step].sections.map((section, index) => (
            <View key={index} style={styles.section}>
              {section.subtitle && (
                <Text style={styles.subtitle}>{section.subtitle}</Text>
              )}
              <Text style={styles.text}>{section.text}</Text>
            </View>
          ))}
          {content[step].isFinal && (
            <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
              <Text style={styles.ctaButtonText}>Los geht's!</Text>
            </TouchableOpacity>
          )}
        </Reanimated.View>
      </ScrollView>
      {!content[step].isFinal && (
        <View style={styles.footerContainer}>
          <View style={styles.buttonBackground}>
            <TouchableOpacity style={styles.addButton} onPress={handleNext}>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondaryBeige60,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  imageContainer: {
    height: height * 0.35,
    justifyContent: "center",
    backgroundColor: theme.colors.secondaryBeige20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    minHeight: height * 0.45,
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: 10,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 5,
    textAlign: "left",
  },
  section: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 10,
    textAlign: "left",
  },
  footerContainer: {
    backgroundColor: "white",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 0,
    margin: 20,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGreen100,
  },
  ctaButton: {
    width: "100%",
    backgroundColor: theme.colors.primaryGreen100,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  ctaButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    color: theme.colors.white,
    textAlign: "center",
  },
});

export default OnboardingScreen4;
