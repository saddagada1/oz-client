import { Image, View } from "react-native";
import { StyleSheet } from "react-native";

interface Props {
  color: string;
  focused: boolean;
}

export function ProfileIcon(props: Props) {
  return (
    <View style={[styles.root, { borderColor: props.color }]}>
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
