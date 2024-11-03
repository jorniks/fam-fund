import { activeFamilyIndexState } from "@/app/state/atoms/atom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export function useInitializeActiveFamilyIndex() {
  const setActiveFamilyIndex = useSetRecoilState(activeFamilyIndexState);
  
  useEffect(() => {
    const stored = window.sessionStorage.getItem("activeFamilyIndex");
    if (stored !== null) {
      setActiveFamilyIndex(Number(stored));
    }
  }, [setActiveFamilyIndex]);
}