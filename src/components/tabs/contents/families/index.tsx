'use client'
import { useEffect, useState } from "react";
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
import { FamilyMemberType, FamilyType } from "@/types";


const Families = ({ listOfFamilies, familyMembers }: { listOfFamilies: FamilyType[], familyMembers: FamilyMemberType[] }) => {
  const { createFamilyAccount } = useContractWrite();
  const [openNewFamily, setOpenNewFamily] = useState<boolean>(false)
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

            <section className="space-y-6 mt-6 w-full pb-12">
              <div className="space-y-2">
                <label htmlFor="familyName" className="block text-sm/6 font-medium">Family Name</label>
                <input id="familyName" type="text" autoComplete="family-name" required className="text-box" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="personalName" className="block text-sm/6 font-medium">Your Name</label>
                <input id="personalName" type="text" autoComplete="given-name" required className="text-box" value={personName} onChange={(e) => setPersonName(e.target.value)} />
              </div>

              <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
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

      <section className="w-full max-w-3xl">
        {listOfFamilies?.map((family, index) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-white rounded-md p-5 text-lg">{family['name']}</AccordionTrigger>

              <AccordionContent className="bg-gray-50 p-6 rounded-b-md">
                {familyMembers?.map((member, index) => (
                  <div className="" key={index}>
                    {member.name}
                  </div>
                ))
                }
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
        }
      </section>
    </>
  )
}

export default Families