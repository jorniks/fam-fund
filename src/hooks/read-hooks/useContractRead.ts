import { useCallback } from "react";
import { useContract } from "../services/useContract";

export default function useContractRead() {
  const contract = useContract();
  
  const getUserFamilies = useCallback(
    async () => {
      try {
        const families = await contract?.getUserFamilies()

        console.log('families', families);
        return families || [];
      } catch (getUserFamiliesError) {
        console.log(getUserFamiliesError);
      }
    }, [contract]
  )
  
  return {
    getUserFamilies
  };
}