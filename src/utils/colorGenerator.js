import chroma from 'chroma-js';

const colorGenerator = (mainColor, darken, alpha, brightness, isDarkMode) => {
  let color = chroma(mainColor)
    .darken(isDarkMode ? 4.5 + darken : darken)
    .alpha(isDarkMode ? 1 : alpha)
    .brighten(isDarkMode ? 0 : brightness);
  return color.hex();
};

export default colorGenerator;
