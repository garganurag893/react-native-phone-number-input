import { useRef, useState } from "react";
import {
  Appearance,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";

type ThemePreference = "system" | "light" | "dark";

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const palette = isDark ? Colors.dark : Colors.light;
  const phoneInput = useRef<PhoneInput>(null);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("1");
  const [valid, setValid] = useState<boolean | null>(null);

  const handleThemePreference = (preference: ThemePreference) => {
    setThemePreference(preference);
    Appearance.setColorScheme(
      preference === "system" ? "unspecified" : preference
    );
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    setValid(null);
  };

  const handleChangeFormattedText = (text: string) => {
    setFormattedValue(text);
  };

  const handleChangeCountry = (country: {
    cca2: string;
    callingCode: string[];
  }) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] ?? "");
    setValid(null);
  };

  const handleCheckNumber = () => {
    const isValid = phoneInput.current?.isValidNumber(value) ?? false;
    setCountryCode(phoneInput.current?.getCountryCode() ?? countryCode);
    setCallingCode(phoneInput.current?.getCallingCode() ?? callingCode);
    setValid(isValid);
  };

  const phoneInputThemeStyles = {
    containerStyle: [
      styles.phoneContainer,
      { backgroundColor: palette.card },
    ],
    textContainerStyle: [
      styles.phoneTextContainer,
      { backgroundColor: palette.input },
    ],
    textInputStyle: [styles.phoneTextInput, { color: palette.text }],
    codeTextStyle: [styles.codeText, { color: palette.text }],
    flagButtonStyle: { backgroundColor: palette.card },
    textInputProps: {
      placeholderTextColor: palette.icon,
      selectionColor: palette.text,
      keyboardAppearance: isDark ? ("dark" as const) : ("light" as const),
    },
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText type="title">Phone number</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter a number, choose a country, then check that it is valid.
            </ThemedText>

            <ThemeToggle
              preference={themePreference}
              onChange={handleThemePreference}
            />

            <PhoneInput
              ref={phoneInput}
              defaultCode="US"
              layout="first"
              placeholder="Enter phone number"
              defaultValue={value}
              onChangeText={handleChangeText}
              onChangeFormattedText={handleChangeFormattedText}
              onChangeCountry={handleChangeCountry}
              withShadow={!isDark}
              withDarkTheme={isDark}
              autoFocus
              {...phoneInputThemeStyles}
            />

            <Pressable
              accessibilityRole="button"
              onPress={handleCheckNumber}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: Colors.light.tint },
                pressed && styles.buttonPressed,
              ]}
            >
              <ThemedText
                lightColor="#fff"
                darkColor="#fff"
                type="defaultSemiBold"
              >
                Check number
              </ThemedText>
            </Pressable>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.cardBorder,
                },
              ]}
            >
              <ResultRow label="National" value={value || "—"} />
              <ResultRow label="Formatted" value={formattedValue || "—"} />
              <ResultRow label="Country" value={countryCode} />
              <ResultRow
                label="Calling code"
                value={callingCode ? `+${callingCode}` : "—"}
              />
              <ResultRow
                label="Valid"
                value={
                  valid === null ? "Not checked" : valid ? "true" : "false"
                }
                emphasis={
                  valid === true
                    ? "valid"
                    : valid === false
                      ? "invalid"
                      : undefined
                }
              />
            </View>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Layout second
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Calling code sits next to the flag instead of the text field.
            </ThemedText>
            <PhoneInput
              defaultCode="GB"
              layout="second"
              placeholder="Enter phone number"
              withShadow={!isDark}
              withDarkTheme={isDark}
              {...phoneInputThemeStyles}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
};

const ThemeToggle = ({
  preference,
  onChange,
}: {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}) => {
  const activeBackground = useThemeColor({}, "input");
  const borderColor = useThemeColor({}, "cardBorder");
  const options: ThemePreference[] = ["system", "light", "dark"];

  return (
    <View style={styles.themeBlock}>
      <ThemedText style={styles.resultLabel}>Appearance</ThemedText>
      <View style={[styles.segment, { borderColor, backgroundColor: activeBackground }]}>
        {options.map((option) => {
          const selected = preference === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.segmentItem,
                selected && styles.segmentItemSelected,
                selected && { backgroundColor: Colors.light.tint },
                pressed && styles.buttonPressed,
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                lightColor={selected ? "#fff" : Colors.light.text}
                darkColor={selected ? "#fff" : Colors.dark.text}
                style={styles.segmentLabel}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const ResultRow = ({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "valid" | "invalid";
}) => {
  return (
    <View style={styles.resultRow}>
      <ThemedText style={styles.resultLabel}>{label}</ThemedText>
      <ThemedText
        type="defaultSemiBold"
        style={[
          styles.resultValue,
          emphasis === "valid" && styles.valid,
          emphasis === "invalid" && styles.invalid,
        ]}
      >
        {value}
      </ThemedText>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  themeBlock: {
    gap: 8,
    marginBottom: 4,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemSelected: {
    backgroundColor: Colors.light.tint,
  },
  segmentLabel: {
    fontSize: 14,
  },
  phoneContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  phoneTextContainer: {
    borderRadius: 0,
  },
  phoneTextInput: {
    fontSize: 16,
  },
  codeText: {
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  card: {
    marginTop: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  resultLabel: {
    opacity: 0.7,
  },
  resultValue: {
    flexShrink: 1,
    textAlign: "right",
  },
  valid: {
    color: "#34C759",
  },
  invalid: {
    color: "#FF453A",
  },
  sectionTitle: {
    marginTop: 16,
  },
});
