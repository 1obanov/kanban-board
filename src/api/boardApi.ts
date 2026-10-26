import boardResponse from "../mocks/board.json";
import type { Board } from "../types/board";

export async function getBoard(): Promise<Board> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return boardResponse.data as Board;
}
