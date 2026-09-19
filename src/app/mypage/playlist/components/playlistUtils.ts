import { MoveDirection } from "./playlistTypes";

export const getMovedIndex = <T>(
  list: T[],
  currentIndex: number,
  direction: MoveDirection,
) => {
  if (direction === "up") return currentIndex - 1;
  if (direction === "down") return currentIndex + 1;
  if (direction === "top") return 0;

  return list.length - 1;
};
