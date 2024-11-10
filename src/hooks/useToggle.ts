import { useState } from "react";

export const useToggle = (defaultValue: boolean) => {
  const [isToggled, setIsToggled] = useState(defaultValue);

  const setToggle = (isToggle: boolean) => {
    setIsToggled(isToggle);
  };

  return { isToggled, setToggle };
};
