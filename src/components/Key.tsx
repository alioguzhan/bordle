import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  value: string;
  width?: number;
  onClick: (value: string) => void;
  isRevealing?: boolean;
};

export const Key = ({ children, width = 32, value, onClick }: Props) => {
  const styles = {
    width: `${width}px`,
    height: "48px",
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value);
    event.currentTarget.blur();
  };

  return (
    <button style={styles} className={"key"} onClick={handleClick}>
      {children || value}
    </button>
  );
};
