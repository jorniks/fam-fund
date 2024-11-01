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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { useState } from "react";


export default function Home() {
  const { createFamilyAccount, createProposal, addFamilyMember } = useContractWrite();
  const [openNewMember, setOpenNewMember] = useState<boolean>(false)
  const [openNewFamily, setOpenNewFamily] = useState<boolean>(false)
  const [openNewProposal, setOpenNewProposal] = useState<boolean>(false)
  const [memberName, setMemberName] = useState<string>('')
  const [memberAddress, setAddressName] = useState<string>('')
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
    <main className="h-ful">
      <section className="bg-white border-t">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between py-8 gap-8">
          <div className="space-x-4 flex items-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-spray-100 rounded-md text-3xl">
              <i className="bi bi-house-heart-fill"></i>
            </div>

            <div className="text-xs">
              <h6 className="text-lg font-semibold">Family of Love</h6>
              <span className="">3 Family members</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-x-10 gap-y-4 md:gap-y-0">
            <div className="flex -space-x-2 overflow-hidden text-lg">
              <div className="flex items-center justify-center font-semibold h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">sd</div>
              <div className="flex items-center justify-center font-semibold h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">sd</div>
              <div className="flex items-center justify-center font-semibold h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">sd</div>
              <div className="flex items-center justify-center font-medium text-xs h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">+3</div>
            </div>

            <Dialog open={openNewMember} onOpenChange={setOpenNewMember}>
              <DialogTrigger className="btn px-6 chestnut text-sm">
                <i className="bi bi-plus-lg"></i> Add Member
              </DialogTrigger>

              <DialogContent className="max-w-md w-full bg-white border-0">
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>

                  <DialogDescription>
                    Grow your family to increase participation in family financial decisions.
                  </DialogDescription>
                </DialogHeader>

                <section className="space-y-6 mt-6 w-full pb-8">
                  <div className="space-y-1">
                    <label htmlFor="memberName" className="block text-sm/6 font-medium">Name of Family Member</label>
                    <input id="memberName" type="text" className="text-box" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="memberAddress" className="block text-sm/6 font-medium">Wallet Address of Family Member</label>
                    <input id="memberAddress" type="text" className="text-box" value={memberAddress} onChange={(e) => setAddressName(e.target.value)} />
                  </div>

                  <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                    addFamilyMember(0, memberAddress, memberName).then(response => {
                      if (response == true) {
                        setMemberName('')
                        setAddressName('')
                        setOpenNewMember(false);
                      }
                    })
                  }}>Add Family Member</Button>
                </section>

              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="">
        <Tabs defaultValue="family" className="w-full space-y-6">
          <TabsList className="w-full">
            <div className="container">
              <TabsTrigger className="pr-4" value="family">My Families</TabsTrigger>
              <TabsTrigger className="px-4" value="proposal">Proposals</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="family">
            <section className="mb-6">
              <Dialog open={openNewFamily} onOpenChange={setOpenNewFamily}>
                <DialogTrigger className="btn px-6 spray-dark text-sm">
                  <i className="bi bi-plus-lg"></i> New Family
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

            <section className="w-full max-w-3xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="bg-white rounded-md p-5 text-lg">Family Name</AccordionTrigger>

                  <AccordionContent className="bg-gray-50 p-6 rounded-b-md">
                    List of family members
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </TabsContent>

          <TabsContent value="proposal">
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
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
