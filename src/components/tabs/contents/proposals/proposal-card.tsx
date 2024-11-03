"use client"

import { Button } from "@/components/button";
import { FamilyMember, FamilyProposals } from "@/types";
import { useState } from "react";
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { formatBalance, formatNumberScale } from "@/functions/format";

const ProposalCard = (
  { proposal, proposalIndex, familyMembers, familyId }:
  { proposal: FamilyProposals, proposalIndex: number, familyMembers: FamilyMember[], familyId: number }
) => {
  const { castVote, claimFunds, vetoProposal } = useContractWrite();
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  return (
    <dl className="md:col-span-2 border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
      <dt className="p-4 pb-1 flex items-center justify-between relative">
        <span className="rounded-full px-4 py-1.5 text-sm font-medium bg-amber-100 text-amber-700">{proposal?.status}</span>
        <i className="bi bi-three-dots-vertical cursor-pointer" onClick={() => setOpenMenu(!openMenu)}></i>

        <div className={`absolute right-4 bg-white border w-2/3 rounded shadow top-12 transition-all duration-150 z-10 ${openMenu ? 'scale-y-100 translate-y-0' : 'scale-y-0 -translate-y-1/2'}`}>
          <div className="border-b p-4 space-y-3">
            <span className="font-bold text-xs text-gray-700">For Parents Only</span>

            <div className="flex items-center justify-between flex-wrap py-2">
              <Button className="btn py-2 px-3 spray"
                onClick={() => vetoProposal(familyId, proposalIndex, 'approved').then(() => setOpenMenu(false))}
              >Approve</Button>

              <Button className="btn py-2 px-3 chestnut"
                onClick={() => vetoProposal(familyId, proposalIndex, 'declined').then(() => setOpenMenu(false))}
              >Decline</Button>
            </div>
          </div>

          <div className="p-4">
            <span className="font-bold text-xs text-gray-700">Proposal Initiator Only</span>

            <Button className="btn spray-dark w-full py-2.5"
              onClick={() => claimFunds(familyId, proposalIndex).then(() => setOpenMenu(false))}
            >Withdraw fund</Button>
          </div>
        </div>
      </dt>

      <div className="p-4 flex-1 space-y-2">
        <dt className="font-semibold text-wrap">{proposal.title}</dt>
        <dd className="text-xs"> {proposal.description} </dd>
      </div>

      <div className="px-4 py-2 font-semibold"> {formatNumberScale(formatBalance(proposal.amount))} AIA </div>

      <div className="p-4 items-center grid grid-cols-12 border-t-2">
        <div className="col-span-7 flex -space-x-2.5 overflow-hidden">
          {familyMembers?.slice(0, 4).map((member, index) => (
            <div key={index} className="flex items-center justify-center h-7 w-7 rounded-full ring-2 spray-dark ring-white font-semibold" title={member.name}>
              <i className="bi bi-person-fill"></i>
            </div>
          ))}

          {familyMembers?.length > 4 &&
            <div className="flex items-center justify-center h-7 w-7 rounded-full ring-2 spray-dark ring-white font-medium text-xs">+{familyMembers?.length - 4}</div>
          }
        </div>

        <div className="col-span-5 flex items-center justify-between">
          <Button className="text-xl flex items-center text-green-600 gap-1" onClick={() => castVote(familyId, proposalIndex, true)}>
            <i className="bi bi-hand-thumbs-up-fill" title="Vote Yes"></i>
            <span className="text-sm">Yes</span>
          </Button>

          <Button className="text-xl flex items-center text-chestnut-600 gap-1" onClick={() => castVote(familyId, proposalIndex, false)}>
            <i className="bi bi-hand-thumbs-down-fill" title="Vote No"></i>
            <span className="text-sm">No</span>
          </Button>
        </div>
      </div>
    </dl>
  )
}

export default ProposalCard