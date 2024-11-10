import { useState } from 'react';

export const useModel = (defaultValue: boolean) => {
  const [isShow, setIsShow] = useState(defaultValue);

  return { isShow, setIsShow };
};
