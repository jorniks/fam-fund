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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import useContractWrite from "@/hooks/write-hooks/useContractWrite";
import { useCallback, useEffect, useState } from "react";
import Families from "@/components/tabs/contents/families";
import Proposals from "@/components/tabs/contents/proposals";
import useContractRead from '@/hooks/read-hooks/useContractRead';
import { FamilyMemberType, FamilyType } from "@/types";
import { useWeb3React } from "@web3-react/core";
import { formatNumberScale } from "@/functions/format";
import { Switch } from "@/components/switch";

export default function Home() {
  const { account } = useWeb3React()
  const { addFamilyMember } = useContractWrite();
  const { getUserFamilies } = useContractRead()
  const [listOfFamilies, setListOfFamilies] = useState<FamilyType[]>([])
  const [openNewMember, setOpenNewMember] = useState<boolean>(false)
  const [memberName, setMemberName] = useState<string>('')
  const [memberAddress, setAddressName] = useState<string>('')
  const [personIsParent, setPersonIsParent] = useState<boolean>(false)
  const activeFamily = 0;

  const loadData = useCallback(
    () => {
      if (account) {
        getUserFamilies().then(setListOfFamilies)
      }
    }, [account, getUserFamilies],
  )

  useEffect(() => {
    loadData()
  }, [loadData])


  return (
    <main className="h-full">
      <section className="bg-white border-t">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between py-8 gap-8">
          <div className="space-x-4 flex items-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-spray-100 rounded-md text-3xl">
              <i className="bi bi-house-heart-fill"></i>
            </div>

            <div className="text-xs">
              <h6 className="text-lg font-semibold">{ listOfFamilies[activeFamily]?.name }&apos;s Family</h6>
              <span className="">{ formatNumberScale(listOfFamilies[activeFamily]?.members?.length || 0) } Family members</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-x-10 gap-y-4 md:gap-y-0">
            <div className="flex -space-x-2 overflow-hidden text-lg">
              {listOfFamilies[activeFamily]?.members?.slice(0, 3).map((member, index) => (
                <div key={index} className="flex items-center justify-center font-semibold h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">{member?.name[0]}</div>
              ))}

              {listOfFamilies[activeFamily]?.members?.length > 3 &&
                <div className="flex items-center justify-center font-medium text-xs h-10 w-10 bg-green-400 rounded-full ring-2 ring-white">+{listOfFamilies[activeFamily]?.members?.length - 3}</div>
              }
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

                <section className="space-y-6 mt-6">
                  <div className="space-y-1">
                    <label htmlFor="memberName" className="block text-sm/6 font-medium">Name of Family Member</label>
                    <input id="memberName" type="text" className="text-box" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="memberAddress" className="block text-sm/6 font-medium">Wallet Address of Family Member</label>
                    <input id="memberAddress" type="text" className="text-box" value={memberAddress} onChange={(e) => setAddressName(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="memberAddress" className="block text-sm/6 font-medium">Is this family member a parent?</label>
                    <div className="gap-x-3 flex items-center">
                      <label className="block text-sm font-medium">No</label>
                      <Switch checked={personIsParent} onClick={() => setPersonIsParent(!personIsParent)} />
                      <label className="block text-sm font-medium">Yes</label>
                    </div>
                  </div>


                  <Button className="btn w-full sm:w-1/2 chestnut h-14" onClick={() => {
                    addFamilyMember(activeFamily, memberAddress, memberName, personIsParent).then(response => {
                      if (response == true) {
                        setMemberName('')
                        setAddressName('')
                        setOpenNewMember(false);
                        getUserFamilies().then(setListOfFamilies)
                      }
                    })
                  }}>Add Family Member</Button>
                </section>

              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="mb-40">
        <Tabs defaultValue="proposal" className="w-full space-y-6">
          <TabsList className="w-full">
            <div className="container">
              <TabsTrigger className="pr-4" value="family">My Families</TabsTrigger>
              <TabsTrigger className="px-4" value="proposal">Proposals</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="family">
            <Families
              listOfFamilies={listOfFamilies}
              account={account}
            />
          </TabsContent>

          <TabsContent value="proposal">
            <Proposals
              activeFamily={activeFamily}
            />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
