import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useContract } from "../services/useContract";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/app/state/atoms/atom";
import { toast } from "@/components/toaster/use-toast";
import { errorCode } from "@/lib/metamask-error-codes";
import { CHAIN_INFO } from "@/lib/services/chain-config";

export default function useContractWrite() {
  const { account, chainId } = useWeb3React();
  const contract = useContract();
  const setLoadingState = useSetRecoilState(loadingState);
  const explorerURL = chainId && CHAIN_INFO[chainId].explorer
  
  const createFamilyAccount = useCallback(
    async(familyName: string, personName: string) => {
      setLoadingState(true);

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return
      }

      if (!familyName) {
        toast({ variant: "error", description: "Family name is required!" })
        setLoadingState(false)
        return
      }

      if (!personName) {
        toast({ variant: "error", description: "Your name is required!" })
        setLoadingState(false)
        return
      }

      try {
        const created = await contract?.createFamily(familyName, personName);
        const createdReceipt = await created.wait();

        toast({
          variant: "success",
          description: `Family account successfully created!`,
          action: { url: `${explorerURL}/tx/${createdReceipt?.hash || createdReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (createFamilyAccountError: {} | any) {
        toast({ variant: "error", description: errorCode[createFamilyAccountError?.code as keyof typeof errorCode] })
        setLoadingState(false)
        return false;
      }


    }, [account, contract, explorerURL, setLoadingState]
  )
  
  return {
    createFamilyAccount
  };
}