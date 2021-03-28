import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
} from "react-native-country-picker-modal";
import { PhoneNumberUtil } from "google-libphonenumber";
import styles from "./styles";

const dropDown =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";
const phoneUtil = PhoneNumberUtil.getInstance();

export default class PhoneInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: props.defaultCode ? undefined : "91",
      number: props.value
        ? props.value
        : props.defaultValue
        ? props.defaultValue
        : "",
      modalVisible: false,
      countryCode: props.defaultCode ? props.defaultCode : "IN",
      disabled: props.disabled || false,
    };
  }

  async componentDidMount() {
    const { defaultCode } = this.props;
    if (defaultCode) {
      const code = await getCallingCode(defaultCode);
      this.setState({ code });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value, disabled: nextDisabled } = nextProps;
    const { number, disabled } = this.state;
    if ((value || value === "") && value !== number) {
      this.setState({ number: value });
    }
    if (disabled !== nextDisabled) {
      this.setState({ disabled: nextDisabled });
    }
  }

  getCountryCode = () => {
    return this.state.countryCode;
  };

  getCallingCode = () => {
    return this.state.code;
  };

  isValidNumber = (number) => {
    try {
      const { countryCode } = this.state;
      const parsedNumber = phoneUtil.parse(number, countryCode);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  onSelect = (country) => {
    const { onChangeCountry } = this.props;
    this.setState(
      {
        countryCode: country.cca2,
        code: country.callingCode[0],
      },
      () => {
        const { onChangeFormattedText } = this.props;
        if (onChangeFormattedText) {
          if (country.callingCode[0]) {
            onChangeFormattedText(
              `+${country.callingCode[0]}${this.state.number}`
            );
          } else {
            onChangeFormattedText(this.state.number);
          }
        }
      }
    );
    if (onChangeCountry) {
      onChangeCountry(country);
    }
  };

  onChangeText = (text) => {
    this.setState({ number: text });
    const { onChangeText, onChangeFormattedText } = this.props;
    if (onChangeText) {
      onChangeText(text);
    }
    if (onChangeFormattedText) {
      const { code } = this.state;
      if (code) {
        onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
      } else {
        onChangeFormattedText(text);
      }
    }
  };

  getNumberAfterPossiblyEliminatingZero() {
    let { number, code } = this.state;
    if (number.length > 0 && number.startsWith("0")) {
      number = number.substr(1);
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    } else {
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    }
  }

  renderDropdownImage = () => {
    return (
      <Image
        source={{ uri: dropDown }}
        resizeMode="contain"
        style={styles.dropDownImage}
      />
    );
  };

  renderFlagButton = (props) => {
    const { layout = "first", flagSize } = this.props;
    const { countryCode } = this.state;
    if (layout === "first") {
      return (
        <Flag
          countryCode={countryCode}
          flagSize={flagSize ? flagSize : DEFAULT_THEME.flagSize}
        />
      );
    }
    return <View />;
  };

  render() {
    const {
      withShadow,
      withDarkTheme,
      codeTextStyle,
      textInputProps,
      textInputStyle,
      autoFocus,
      placeholder,
      disableArrowIcon,
      flagButtonStyle,
      containerStyle,
      textContainerStyle,
      renderDropdownImage,
      countryPickerProps = {},
      filterProps = {},
      countryPickerButtonStyle,
      layout = "first",
    } = this.props;
    const { modalVisible, code, countryCode, number, disabled } = this.state;
    return (
      <CountryModalProvider>
        <View
          style={[
            styles.container,
            withShadow ? styles.shadow : {},
            containerStyle ? containerStyle : {},
          ]}
        >
          <TouchableOpacity
            style={[
              styles.flagButtonView,
              layout === "second" ? styles.flagButtonExtraWidth : {},
              flagButtonStyle ? flagButtonStyle : {},
              countryPickerButtonStyle ? countryPickerButtonStyle : {},
            ]}
            disabled={disabled}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <CountryPicker
              onSelect={this.onSelect}
              withEmoji
              withFilter
              withFlag
              filterProps={filterProps}
              countryCode={countryCode}
              withCallingCode
              disableNativeModal={disabled}
              visible={modalVisible}
              theme={withDarkTheme ? DARK_THEME : DEFAULT_THEME}
              renderFlagButton={this.renderFlagButton}
              onClose={() => this.setState({ modalVisible: false })}
              {...countryPickerProps}
            />
            {code && layout === "second" && (
              <Text
                style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}
              >{`+${code}`}</Text>
            )}
            {!disableArrowIcon && (
              <React.Fragment>
                {renderDropdownImage
                  ? renderDropdownImage
                  : this.renderDropdownImage()}
              </React.Fragment>
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.textContainer,
              textContainerStyle ? textContainerStyle : {},
            ]}
          >
            {code && layout === "first" && (
              <Text
                style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}
              >{`+${code}`}</Text>
            )}
            <TextInput
              style={[styles.numberText, textInputStyle ? textInputStyle : {}]}
              placeholder={placeholder ? placeholder : "Phone Number"}
              onChangeText={this.onChangeText}
              value={number}
              editable={disabled ? false : true}
              selectionColor="black"
              keyboardAppearance={withDarkTheme ? "dark" : "default"}
              keyboardType="number-pad"
              autoFocus={autoFocus}
              {...textInputProps}
            />
          </View>
        </View>
      </CountryModalProvider>
    );
  }
}
