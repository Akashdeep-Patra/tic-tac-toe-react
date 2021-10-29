import "./styles.css";
import { useState, useEffect } from "react";
export interface BlockType {
  id: number;
  selected?: "X" | "Y";
}

const BLOCKS: BlockType[][] = [
  [{ id: 0 }, { id: 1 }, { id: 2 }],
  [{ id: 3 }, { id: 4 }, { id: 5 }],
  [{ id: 6 }, { id: 7 }, { id: 8 }]
];
const checkWinner = (blocks: BlockType[][]) => {
  // check row wise
  const winners = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const pos of winners) {
    const [a, b, c] = pos;

    if (
      blocks[Math.floor(a / 3)][a % 3].selected &&
      blocks[Math.floor(b / 3)][b % 3].selected ===
        blocks[Math.floor(c / 3)][c % 3].selected &&
      blocks[Math.floor(a / 3)][a % 3].selected ===
        blocks[Math.floor(c / 3)][c % 3].selected
    ) {
      return blocks[Math.floor(a / 3)][a % 3].selected;
    }
  }
  return null;
};
export default function App() {
  const [blocks, setBlocks] = useState<BlockType[][]>(BLOCKS);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "Y">("X");
  const [winner, setWinner] = useState<null | "X" | "Y">(null);
  const [isDraw, setIsDraw] = useState(false);
  const handleClick = (id: number) => {
    if (
      blocks.some((blockRow) =>
        blockRow.some((block) => block.id === id && block.selected)
      )
    ) {
      console.log("not clicked");

      return;
    }
    setBlocks(
      blocks.map((blockRow) =>
        blockRow.map((block) => {
          if (block.id !== id) return block;
          return { ...block, selected: currentPlayer };
        })
      )
    );
    setCurrentPlayer((cp) => (cp === "X" ? "Y" : "X"));
  };

  useEffect(() => {
    const possibleWinner = checkWinner(blocks);
    if (possibleWinner) {
      setWinner(possibleWinner);
    }
    if (
      blocks.reduce(
        (accRow, blockRow) =>
          blockRow.reduce((acc, block) => (block.selected ? 1 + acc : acc), 0) +
          accRow,
        0
      ) === 9 &&
      !possibleWinner
    ) {
      setIsDraw(true);
    }
  }, [blocks, winner]);

  const renderBlocks = () => {
    return blocks
      .reduce((acc, block) => [...acc, ...block], [])
      .map((block) => (
        <span
          className={block.selected ?? "not-selected"}
          key={block.id}
          onClick={() => handleClick(block.id)}
        >
          {block.selected}
        </span>
      ));
  };

  return (
    <>
      <div className="current-player">{`Current Player: ${currentPlayer}`}</div>
      <div className="current-player">{winner && `Player ${winner} Won`}</div>
      <div className="current-player">
        {isDraw && `This seems like a Draw `}
      </div>

      <div className="App">{renderBlocks()}</div>
    </>
  );
}
