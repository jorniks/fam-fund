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
        return false
      }

      if (!familyName) {
        toast({ variant: "error", description: "Family name is required!" })
        setLoadingState(false)
        return false
      }

      if (!personName) {
        toast({ variant: "error", description: "Your name is required!" })
        setLoadingState(false)
        return false
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
        toast({ variant: "error", description: errorCode[createFamilyAccountError?.code as keyof typeof errorCode] || createFamilyAccountError?.code })
        setLoadingState(false)
        return false;
      }


    }, [account, contract, explorerURL, setLoadingState]
  )

  const createProposal = useCallback(
    async (familyId: number, description: string, amount: string, recipient: string, title: string, duration: string) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }

      if (!isAddress(recipient)) {
        toast({ variant: "error", description: "Wallet address to receive funds is not valid" })
        setLoadingState(false)
        return false
      }

      if (!description) {
        toast({ variant: "error", description: "Proposal description is required" })
        setLoadingState(false)
        return false
      }

      if (!amount) {
        toast({ variant: "error", description: "Proposal amount is required" })
        setLoadingState(false)
        return false
      }

      const proposedAmount = formatToBigInt(amount, 18)

      try {
        const createdProposal = await contract?.createProposal(familyId, title, description, proposedAmount, recipient, (new Date(duration).getTime() / 1000))
        const createdProposalReceipt = await createdProposal.wait();

        toast({
          variant: "success",
          description: `Spend proposal successfully submitted!`,
          action: { url: `${explorerURL}/tx/${createdProposalReceipt?.hash || createdProposalReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true
      } catch (createProposalError: {} | any) {
        toast({ variant: "error", description: errorCode[createProposalError?.code as keyof typeof errorCode] || createProposalError?.code })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const addFamilyMember = useCallback(
    async (familyId: number, memberAddress: string, memberName: string, personIsParent: boolean) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }

      if (!isAddress(memberAddress)) {
        toast({ variant: "error", description: "Family member wallet address is not valid" })
        setLoadingState(false)
        return false
      }

      if (!memberName) {
        toast({ variant: "error", description: "Family member name is required" })
        setLoadingState(false)
        return false
      }
      
      try {
        const addedMember = await contract?.addMember(familyId, memberAddress, memberName, personIsParent)
        const addedMemberReceipt = await addedMember.wait()

        toast({
          variant: "success",
          description: `Family account successfully created!`,
          action: { url: `${explorerURL}/tx/${addedMemberReceipt?.hash || addedMemberReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (addFamilyMemberError: {} | any) {
        toast({ variant: "error", description: errorCode[addFamilyMemberError?.code as keyof typeof errorCode] || addFamilyMemberError?.code })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const deleteFamilyAccount = useCallback(
    async (familyId: number) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }
      
      try {
        const deletedFamily = await contract?.deleteFamily(familyId)
        const deletedFamilyReceipt = await deletedFamily.wait()

        toast({
          variant: "success",
          description: `Family account successfully deleted!`,
          action: { url: `${explorerURL}/tx/${deletedFamilyReceipt?.hash || deletedFamilyReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (deleteFamilyAccountError: {} | any) {
        toast({ variant: "error", description: errorCode[deleteFamilyAccountError?.code as keyof typeof errorCode] || deleteFamilyAccountError?.code })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )
  
  return {
    createFamilyAccount,
    createProposal,
    addFamilyMember,
    deleteFamilyAccount
  };
}