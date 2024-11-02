'use client'
import { useState } from "react";
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
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { FamilyType } from "@/types";
import { shortenAddress } from "@/functions/format";
import { copyToClipboard } from "@/functions/misc-functions";
import { toast } from "@/components/toaster/use-toast";


const Families = (
  { listOfFamilies, account }:
  { listOfFamilies: FamilyType[], account: string | undefined }
) => {
  const { createFamilyAccount, deleteFamilyAccount } = useContractWrite();
  const [openNewFamily, setOpenNewFamily] = useState<boolean>(false)
  const [openDeleteFamily, setOpenDeleteFamily] = useState<boolean>(false)
  const [openRemoveMember, setOpenRemoveMember] = useState<boolean>(false)
  const [familyName, setFamilyName] = useState<string>('')
  const [personName, setPersonName] = useState<string>('')
  
  return (
    <>
      <section className="mb-6">
        <Dialog open={openNewFamily} onOpenChange={setOpenNewFamily}>
          <DialogTrigger className="btn px-6 spray-dark text-sm">
            <i className="bi bi-plus-lg"></i> New Family
          </DialogTrigger>

          <DialogContent className="max-w-md w-full bg-white border-0">
            <DialogHeader>
              <DialogTitle>Create Family Account</DialogTitle>

              <DialogDescription>
                This action will create an account for your family with a wallet to manage the funds placed in it.
              </DialogDescription>
            </DialogHeader>

            <section className="space-y-6 mt-6">
              <div className="space-y-2">
                <label htmlFor="familyName" className="block text-sm font-medium">Family Name</label>
                <input id="familyName" type="text" autoComplete="family-name" required className="text-box" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="personalName" className="block text-sm font-medium">Your Name</label>
                <input id="personalName" type="text" autoComplete="given-name" required className="text-box" value={personName} onChange={(e) => setPersonName(e.target.value)} />
              </div>

              <Button className="btn w-full sm:w-1/2 spray-dark h-14" onClick={() => {
                createFamilyAccount(familyName, personName).then(response => {
                  if (response == true) {
                    setFamilyName('')
                    setPersonName('')
                    setOpenNewFamily(false);
                  }
                })
              }}>Create Family</Button>
            </section>

          </DialogContent>
        </Dialog>
      </section>

      <section className="w-full max-w-3xl space-y-4">
        {listOfFamilies.length > 0 ?
          listOfFamilies?.map((family, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value="item-1">
                <AccordionTrigger className="bg-white rounded-md p-5 text-lg">
                  <div className="text-left">
                    <h6 className="-mb-3">{family['name']}</h6>
                    <span className="text-xs">Created by {family.creator === account ? "You" : family.creatorName}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="bg-gray-50 py-6 px-4 rounded-b-md">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="bg-white rounded-md p-5">Family Members</AccordionTrigger>

                      <AccordionContent className="bg-gray-100 py-4 px-6 rounded-b-md">
                        <div className="flex flex-col">
                          <div className=" overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                              <div className="overflow-hidden ">
                                <table className=" min-w-full rounded-xl">
                                  <thead>
                                    <tr className="bg-gray-200 text-left text-sm font-semibold">
                                      <th scope="col" className="p-3"> Name </th>
                                      <th scope="col" className="p-3"> Wallet </th>
                                      <th scope="col" className="p-3"> Role </th>
                                      <th scope="col" className="p-3"> Actions </th>
                                    </tr>
                                  </thead>

                                  <tbody className="divide-y divide-gray-300">
                                    {family.members?.map((member, index) => (
                                      <tr className="text-sm font-medium" key={index}>
                                        <td className="p-3 whitespace-nowrap">{member.name}</td>
                                        <td className="p-3 whitespace-nowrap">
                                          <span className="border-dotted border-b border-black cursor-copy" onClick={() => {
                                            copyToClipboard(member.addr).then(() => toast({ variant: "success", description: "Address successfully copied!" }))
                                          }}>{shortenAddress(member.addr)}</span>
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{Number(member.role) === 1 ? 'Parent' : 'Child'}</td>

                                        <td className=" p-3">
                                          <Dialog open={openRemoveMember} onOpenChange={setOpenRemoveMember}>
                                            <DialogTrigger className="text-chestnut-600 text-lg">
                                              <i className="bi bi-trash3"></i>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-md w-full bg-white border-0">
                                              <DialogHeader>
                                                <DialogTitle>Confirm Remove Family Member</DialogTitle>

                                                <DialogDescription>
                                                  This action will remove the user from this family.
                                                </DialogDescription>
                                              </DialogHeader>

                                              <section className="space-y-8">
                                                <div className="block text-sm font-medium">
                                                  You can close this prompt if you don&apos;t wish to continue or click the button below to remove the user.
                                                </div>

                                                <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                                                  deleteFamilyAccount(index).then(response => {
                                                    if (response == true) {
                                                      setOpenRemoveMember(false);
                                                    }
                                                  })
                                                }}>Yes, Remove Member</Button>
                                              </section>
                                            </DialogContent>
                                          </Dialog>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <section className="space-y-5 px-4 mt-6 mb-12">
                    <div className="-space-y-1 text-xs">
                      <label className="text-base font-semibold">500 AIA</label>
                      <label className="block">Requires atleast 51% vote or parent&apos;s approval to withdraw</label>
                    </div>

                    <div className="-space-y-1 text-xs">
                      <label className="text-base font-semibold">1500 AIA</label>
                      <label className="block">Requires atleast 75% vote or parent&apos;s approval to withdraw</label>
                    </div>

                    <div className="-space-y-1 text-xs">
                      <label className="text-base font-semibold">above 1500 AIA</label>
                      <label className="block">Requires 100% vote or parent&apos;s approval to withdraw</label>
                    </div>
                  </section>
                  
                  <Dialog open={openDeleteFamily} onOpenChange={setOpenDeleteFamily}>
                    <DialogTrigger className="btn px-6 chestnut text-sm">
                      Delete Family Account
                    </DialogTrigger>

                    <DialogContent className="max-w-md w-full bg-white border-0">
                      <DialogHeader>
                        <DialogTitle>Confirm Delete Family Account</DialogTitle>

                        <DialogDescription>
                          This action will delete the family account and transfer all the remaining funds in the account to every member of the family.
                        </DialogDescription>
                      </DialogHeader>

                      <section className="space-y-8">
                        <div className="block text-sm font-medium">
                          You can close this prompt if you don&apos;t wish to continue or click the button below to delete the account.
                        </div>

                        <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                          deleteFamilyAccount(index).then(response => {
                            if (response == true) {
                              setOpenDeleteFamily(false);
                            }
                          })
                        }}>Yes, Delete Family</Button>
                      </section>
                    </DialogContent>
                  </Dialog>

                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        :
          <div className="font-medium text-lg">
            No family account created yet
          </div>
        }
      </section>
    </>
  )
}

export default Families