export const listColor = [
  "#3ABFBF",
  "#B07CC9",
  " #ff7e67",
  "#bbb3ec",
  "#ff1d58",
  "#42b883",
  "#cdc341",
  "#47b1c2",
  "#0049B7",
  "#f1b963",
  "#a13939",
  "#304d4e",
];

export const randomColor = () => {
  const randomIndex = Math.floor(Math.random() * listColor.length);
  return listColor[randomIndex];
};
