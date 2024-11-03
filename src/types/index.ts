
export type FamilyType = {
  creator: string,
  creatorName: string,
  familyAddress: string,
  familyId: number,
  name: string,
  memberList: FamilyMember[],
  proposals: FamilyProposals[],
  walletBalance: number
}

export type FamilyMember ={
  addr: string,
  isParent: boolean
  name: string,
}

export type FamilyProposals = {
  amount: number,
  description: string,
  endDate: number,
  proposer: string,
  recipient: string,
  status: string,
  title: string,
  votesAgainst: number,
  votesFor: number,
}