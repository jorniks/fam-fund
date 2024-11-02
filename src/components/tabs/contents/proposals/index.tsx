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
import useContractRead from "@/hooks/read-hooks/useContractRead";
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { ProposalType } from "@/types";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";

const Proposals = ({ activeFamily }: { activeFamily: number }) => {
  const { account } = useWeb3React()
  const { createProposal } = useContractWrite();
  const [familyProposals, setFamilyProposals] = useState<ProposalType[]>([])
  const [openNewProposal, setOpenNewProposal] = useState<boolean>(false)
  const [proposalObj, setProposalObj] = useState({
    recipient: "",
    details: "",
    amount: ""
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

            <section className="space-y-4 mt-6 pb-4">
              <div className="space-y-1">
                <label htmlFor="amount" className="block text-sm/6 font-medium">Proposed Spend Amount</label>
                <input id="amount" type="text" className="text-box" value={proposalObj.amount} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1">
                <label htmlFor="recipient" className="block text-sm/6 font-medium">Wallet Address To Receive Funds</label>
                <input id="recipient" type="text" className="text-box" value={proposalObj.recipient} onChange={fillProposalForm} />
              </div>

              <div className="space-y-1">
                <label htmlFor="details" className="block text-sm/6 font-medium">Proposal Description</label>
                <textarea id="details" className="text-box" onChange={fillProposalForm}>{proposalObj.details}</textarea>
              </div>

              <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                createProposal(0, proposalObj.details, proposalObj.amount, proposalObj.recipient).then(response => {
                  if (response == true) {
                    setProposalObj({
                      recipient: "",
                      details: "",
                      amount: ""
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
          <dl key={index} className="md:col-span-2 divide-y border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
            <div className="p-4 flex-1 flex flex-col">
              <dt className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">Miracle</span>
                <i className="bi bi-three-dots-vertical"></i>
              </dt>

              <dd className="text-sm flex-1">
                {proposal.description}
              </dd>

              <div className="">
                <span className="font-semibold">{ formatNumberScale(formatBalance(proposal.amount)) } AIA</span>
              </div>
            </div>

            <div className="p-4">
              frerger
            </div>
          </dl>
        ))
        }

        <dl className="md:col-span-2 divide-y border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
          <div className="p-4 flex-1">
            <dt className="mb-6 flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">Miracle</span>
              <i className="bi bi-three-dots-vertical"></i>
            </dt>

            <dd className="text-sm mt-3">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste sit rerum obcaecati. Dicta rerum, neque voluptate non at, commodi laborum quia labore voluptatem asperiores a natus? Quod fuga fugiat perspiciatis?
            </dd>
          </div>

          <div className="p-4">
            frerger
          </div>
        </dl>

        <dl className="md:col-span-2 divide-y border hover:shadow-sm duration-500 bg-white rounded flex flex-col">
          <div className="p-4 flex-1">
            <dt className="mb-6 flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">Miracle</span>
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