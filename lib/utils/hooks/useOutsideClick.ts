import * as React from "react";
import { RefObject, useEffect } from "react";

const useOutsideClick = (ref : RefObject<HTMLDivElement | null>, callback : () => void) => {

  const handleClick = (e : any) => {
    if (ref && ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;