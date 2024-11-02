'use client'

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { formatBalance, formatNumberScale } from "@/functions/format";
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { FamilyProposals } from "@/types";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

const Proposals = ({ familyProposals, activeFamily }: { familyProposals: FamilyProposals[], activeFamily: number }) => {
  const { account } = useWeb3React()
  const { createProposal, castVote, claimFunds, vetoProposal } = useContractWrite();
  const [openNewProposal, setOpenNewProposal] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [proposalObj, setProposalObj] = useState({
    recipient: "",
    description: "",
    amount: "",
    title: "",
    duration: "",
  })

  const fillProposalForm = (e: any) => {
    if (e.target.id == 'amount') {
      if (Number(e.target.value) > -1 || e.target.value === '') {
        setProposalObj(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
      }

      return
    }

    setProposalObj(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  
  return (
    <>
      <section className="mb-6">
        <Dialog open={openNewProposal} onOpenChange={setOpenNewProposal}>
          <DialogTrigger className="btn px-6 spray-dark text-sm">
            <i className="bi bi-plus-lg"></i> New Proposal
          </DialogTrigger>

          <DialogContent className="max-w-lg w-full bg-white border-0">
            <DialogHeader>
              <DialogTitle>Create Spending Proposal</DialogTitle>

              <DialogDescription>
                This action will create a spending proposal for your family members to consider
              </DialogDescription>
            </DialogHeader>

            <section className="gap-4 mt-6 pb-4 grid grid-cols-1 sm:grid-cols-6">
              <div className="space-y-1 sm:col-span-3">
                <label htmlFor="duration" className="block text-sm font-medium">Deadline of Proposal</label>
                <input id="duration" type="datetime-local" className="text-box" value={proposalObj.duration} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium">Proposed Spend Amount</label>
                <input id="amount" type="text" className="text-box" value={proposalObj.amount} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="recipient" className="block text-sm font-medium">Wallet Address To Receive Funds</label>
                <input id="recipient" type="text" className="text-box" value={proposalObj.recipient} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium">Title of Proposal</label>
                <input id="title" type="text" className="text-box" value={proposalObj.title} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1 sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium">Description of Proposal</label>
                <textarea id="description" className="text-box" rows={3} onChange={fillProposalForm}>{proposalObj.description}</textarea>
              </div>

              <Button className="btn w-full sm:w-1/2 chestnut h-14 sm:col-span-6" onClick={() => {
                createProposal(0, proposalObj.description, proposalObj.amount, proposalObj.recipient, proposalObj.title, proposalObj.duration).then(response => {
                  if (response == true) {
                    setProposalObj({
                      recipient: "",
                      description: "",
                      amount: "",
                      title: "",
                      duration: "",
                    })
                    setOpenNewProposal(false);
                  }
                })
              }}>Submit Proposal</Button>
            </section>

          </DialogContent>
        </Dialog>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-10 gap-4">
        {familyProposals?.map((proposal, index) => (
          <dl key={index} className="md:col-span-2 border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
            <dt className="p-4 flex items-center justify-between relative">
              <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">{proposal.proposerName}</span>
              <i className="bi bi-three-dots-vertical cursor-pointer" onClick={() => setOpenMenu(openMenu ? null : 1)}></i>

              <div className={`absolute right-4 bg-white border w-2/3 rounded shadow top-12 transition-all duration-150 z-10 ${openMenu ? 'scale-y-100 translate-y-0' : 'scale-y-0 -translate-y-1/2'}`}>
                <div className="border-b p-4 space-y-3">
                  <span className="font-bold text-xs text-gray-700">For Parents Only</span>

                  <div className="flex items-center justify-between flex-wrap py-2">
                    <Button className="btn py-2 px-3 spray"
                      onClick={() => vetoProposal(activeFamily, index, 'approved').then(() => setOpenMenu(null))}
                    >Approve</Button>

                    <Button className="btn py-2 px-3 chestnut"
                      onClick={() => vetoProposal(activeFamily, index, 'declined').then(() => setOpenMenu(null))}
                    >Decline</Button>
                  </div>
                </div>

                <div className="p-4">
                  <span className="font-bold text-xs text-gray-700">Proposal Initiator Only</span>

                  <Button className="btn spray-dark w-full py-2.5"
                    onClick={() => claimFunds(activeFamily, index).then(() => setOpenMenu(null))}
                  >Withdraw fund</Button>
                </div>
              </div>
            </dt>

            <div className="p-4 flex-1">
              <dt className="font-semibold text-wrap">{proposal.title}</dt>

              <dd className="text-sm"> {proposal.description} </dd>

              <div className="">
                <span className="font-semibold">{ formatNumberScale(formatBalance(proposal.amount)) } AIA</span>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className={`flex justify-between text-[0.4rem] font-semibold  h-2 relative`}>
              <div style={{ width: `${proposal.forPercentage}%` }} className={`spray rounded-l-full`}>
                <span className="px-1 absolute left-1"> {proposal.forPercentage}% </span>
              </div>

              <div style={{ width: `${proposal.againstPercentage}%` }} className={`chestnut rounded-r-full`}>
                <span className="px-1 absolute right-1"> {proposal.againstPercentage}% </span>
              </div>
            </div>

            <div className="p-4 items-center grid grid-cols-12">
              <div className="col-span-7 flex -space-x-2 overflow-hidden">
                {proposal?.allowedVoters?.slice(0, 4).map((voterAddress, index) => (
                  <div key={index} className="flex items-center text-sm justify-center font-semibold h-7 w-7 spray-dark rounded-full ring-2 ring-white">{String(voterAddress).substring(index, 2)}</div>
                ))}

                {proposal?.allowedVoters?.length > 4 &&
                  <div className="flex items-center justify-center font-medium text-xs h-7 w-7 spray rounded-full ring-2 ring-green-600">+{proposal?.allowedVoters?.length - 4}</div>
                }
              </div>

              <div className="col-span-5 flex items-center justify-between">
                <span className="text-xl flex items-center cursor-pointer hover:text-spray-500 gap-1" onClick={() => castVote(activeFamily, index, true)}>
                  <i className="bi bi-hand-thumbs-up-fill" title="Vote Yes"></i>
                  <span className="text-sm">Yes</span>
                </span>

                <span className="text-xl flex items-center cursor-pointer hover:text-chestnut-500 gap-1" onClick={() => castVote(activeFamily, index, false)}>
                  <i className="bi bi-hand-thumbs-down-fill" title="Vote No"></i>
                  <span className="text-sm">No</span>
                </span>
              </div>
            </div>
          </dl>
        ))}

        <dl className="md:col-span-2 border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
          <dt className="p-4 pb-1 flex items-center justify-between relative">
            <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">Miracle</span>
            <i className="bi bi-three-dots-vertical cursor-pointer" onClick={() => setOpenMenu(openMenu ? null : 1)}></i>

            <div className={`absolute right-4 bg-white border w-2/3 rounded shadow top-12 transition-all duration-150 z-10 ${openMenu ? 'scale-y-100 translate-y-0' : 'scale-y-0 -translate-y-1/2'}`}>
              <div className="border-b p-4 space-y-3">
                <span className="font-bold text-xs text-gray-700">For Parents Only</span>

                <div className="flex items-center justify-between flex-wrap py-2">
                  <Button className="btn py-2 px-3 spray">Approve</Button>
                  <Button className="btn py-2 px-3 chestnut">Decline</Button>
                </div>
              </div>

              <div className="p-4">
                <span className="font-bold text-xs text-gray-700">Proposal Initiator Only</span>

                <Button className="btn spray-dark w-full py-2.5"
                >Withdraw fund</Button>
              </div>
            </div>
          </dt>

          <div className="p-4 flex-1 space-y-2">
            <dt className="font-semibold text-wrap">Title man of the day</dt>

            <dd className="text-xs">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste sit rerum obcaecati. Dicta rerum, neque voluptate non at, commodi laborum quia labore voluptatem asperiores a natus? Quod fuga fugiat perspiciatis?
            </dd>

            <div className="mt-4">
              <span className="font-semibold">20 AIA</span>
            </div>
          </div>

          <div className={`flex justify-between text-[0.4rem] font-semibold  h-2 relative mx-2`}>
            <div style={{ width: `77%` }} className={`spray rounded-l-full`}>
              <span className="px-1 absolute left-1"> 50% </span>
            </div>

            <div style={{ width: `23%` }} className={`chestnut rounded-r-full`}>
              <span className="px-1 absolute right-1"> 50% </span>
            </div>
          </div>

          <div className="p-4 items-center grid grid-cols-12">
            <div className="col-span-7 flex -space-x-2 overflow-hidden">
              <div className="flex items-center text-sm justify-center font-semibold h-7 w-7 spray-dark rounded-full ring-2 ring-white">{String('0x32fe').substring(0, 2)}</div>
              <div className="flex items-center text-sm justify-center font-semibold h-7 w-7 spray-dark rounded-full ring-2 ring-white">{String('0x32fe').substring(0, 2)}</div>
              <div className="flex items-center text-sm justify-center font-semibold h-7 w-7 spray-dark rounded-full ring-2 ring-white">{String('0x32fe').substring(0, 2)}</div>
              <div className="flex items-center text-sm justify-center font-semibold h-7 w-7 spray-dark rounded-full ring-2 ring-white">{String('0x32fe').substring(0, 2)}</div>
            </div>

            <div className="col-span-5 flex items-center justify-between">
              <span className="text-xl flex items-center cursor-pointer hover:text-spray-500 gap-1">
                <i className="bi bi-hand-thumbs-up-fill" title="Vote Yes"></i>
                <span className="text-sm">Yes</span>
              </span>

              <span className="text-xl flex items-center cursor-pointer hover:text-chestnut-500 gap-1">
                <i className="bi bi-hand-thumbs-down-fill" title="Vote No"></i>
                <span className="text-sm">No</span>
              </span>
            </div>
          </div>
        </dl>

        <dl className="md:col-span-2 divide-y border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
          <div className="p-4 flex-1">
            <dt className="mb-6 flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">Miracle</span>
              <i className="bi bi-three-dots-vertical"></i>
            </dt>

            <dd className="text-sm mt-3">
              Dicta rerum, neque voluptate non at, commodi laborum quia labore voluptatem asperiores a natus? Quod fuga fugiat perspiciatis?
            </dd>
          </div>

          <div className="p-4">
            frerger
          </div>
        </dl>
      </section>
    </>
  )
}

export default Proposals