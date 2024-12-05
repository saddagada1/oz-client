import { Image, View, ViewProps } from "react-native";
import { StyleSheet } from "react-native";

type ProfileIconProps = ViewProps & {
  color: string;
};

export function ProfileIcon({ style, color, ...otherProps }: ProfileIconProps) {
  return (
    <View
      style={[
        styles.root,
        {
          borderColor: color,
        },
        style,
      ]}
      {...otherProps}
    >
      <Image source={require("@/assets/images/hendrix.jpg")} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
