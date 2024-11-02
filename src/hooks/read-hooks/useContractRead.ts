import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useContract } from "../services/useContract";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/app/state/atoms/atom";
import { toast } from "@/components/toaster/use-toast";
import { errorCode } from "@/lib/metamask-error-codes";
import { CHAIN_INFO } from "@/lib/services/chain-config";
import { isAddress } from "ethers";
import { formatToBigInt } from "@/functions/format";

export default function useContractRead() {
  const { account, chainId } = useWeb3React();
  const contract = useContract();
  const setLoadingState = useSetRecoilState(loadingState);
  const explorerURL = chainId && CHAIN_INFO[chainId].explorer
  
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