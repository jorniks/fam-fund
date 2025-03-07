import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useContract } from "../services/useContract";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/app/state/atoms/atom";
import { toast } from "@/components/toaster/use-toast";
import { CHAIN_INFO } from "@/lib/services/chain-config";
import { isAddress } from "ethers";
import { formatToBigInt } from "@/functions/format";
import { extractErrorMessage } from "@/functions/misc-functions";

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
        const errorMessage = extractErrorMessage(createFamilyAccountError);
        toast({ variant: "error", description: errorMessage })
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
        const errorMessage = extractErrorMessage(createProposalError);
        toast({ variant: "error", description: errorMessage })
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
        const addedMember = await contract?.addMember(familyId, memberName, memberAddress, personIsParent)
        const addedMemberReceipt = await addedMember.wait()

        toast({
          variant: "success",
          description: `Family account successfully created!`,
          action: { url: `${explorerURL}/tx/${addedMemberReceipt?.hash || addedMemberReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (addFamilyMemberError: {} | any) {
        const errorMessage = extractErrorMessage(addFamilyMemberError);
        toast({ variant: "error", description: errorMessage })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const removeFamilyMember = useCallback(
    async (familyId: number, memberAddress: string) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }
      
      try {
        const removedFamily = await contract?.removeMember(familyId, memberAddress)
        const removedFamilyReceipt = await removedFamily.wait()

        toast({
          variant: "success",
          description: `Family member successfully removed!`,
          action: { url: `${explorerURL}/tx/${removedFamilyReceipt?.hash || removedFamilyReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (removeFamilyMemberError: {} | any) {
        const errorMessage = extractErrorMessage(removeFamilyMemberError);
        toast({ variant: "error", description: errorMessage })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const castVote = useCallback(
    async (familyId: number, proposalId: number, inFavor: boolean) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }
      
      try {
        const castedVote = await contract?.vote(familyId, proposalId, inFavor)
        const castedVoteReceipt = await castedVote.wait()

        toast({
          variant: "success",
          description: `Vote successfully saved!`,
          action: { url: `${explorerURL}/tx/${castedVoteReceipt?.hash || castedVoteReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (castVoteError: {} | any) {
        const errorMessage = extractErrorMessage(castVoteError);
        toast({ variant: "error", description: errorMessage })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const claimFunds = useCallback(
    async (familyId: number, proposalId: number) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }
      
      try {
        const claimedFund = await contract?.claimFunds(familyId, proposalId)
        const claimedFundReceipt = await claimedFund.wait()

        toast({
          variant: "success",
          description: `Funds withdrawn successfully!`,
          action: { url: `${explorerURL}/tx/${claimedFundReceipt?.hash || claimedFundReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (claimFundsError: {} | any) {
        const errorMessage = extractErrorMessage(claimFundsError);
        toast({ variant: "error", description: errorMessage })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )

  const vetoProposal = useCallback(
    async (familyId: number, proposalId: number, approvalStatus: string) => {
      setLoadingState(true)

      if (!account) {
        toast({ variant: "error", description: "No connected wallet!" })
        setLoadingState(false)
        return false
      }
      
      try {
        const vetodProposal = await contract?.vetoProposal(familyId, proposalId, approvalStatus)
        const vetodProposalReceipt = await vetodProposal.wait()

        toast({
          variant: "success",
          description: `Veto action successfully executed!`,
          action: { url: `${explorerURL}/tx/${vetodProposalReceipt?.hash || vetodProposalReceipt?.transactionHash}`, label: "View in explorer" }
        })
        setLoadingState(false)
        return true;
      } catch (vetoProposalError: {} | any) {
        const errorMessage = extractErrorMessage(vetoProposalError);
        toast({ variant: "error", description: errorMessage })
        setLoadingState(false)
        return false;
      }
    }, [account, contract, explorerURL, setLoadingState]
  )
  
  return {
    createFamilyAccount,
    createProposal,
    addFamilyMember,
    removeFamilyMember,
    castVote,
    claimFunds,
    vetoProposal
  };
}