import useWindowDimensions from "./useWindowDimension"

const useDeviceType = () => {
  const { deviceWidth } = useWindowDimensions();

  let deviceType: string;

  if (deviceWidth < 768) {
    deviceType = "mobile";
  } else if (deviceWidth < 1280) {
    deviceType = "tablet";
  } else {
    deviceType = "pc";
  }

  return deviceType;
}

export default useDeviceType;