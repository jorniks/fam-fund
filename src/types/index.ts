
export type FamilyType = {
  name: string,
  familyAddress: string,
  proposalCount: number,
  creationDate: number,
  memberCount: number,
  creatorName: string,
  creator: string
}

export type FamilyMemberType = {
  name: string,
  address: string
}

export type ProposalType = {
  proposer: string,
  description: string,
  amount: number,
  recipient: string,
  votesFor: number,
  votesAgainst: number,
  executed: boolean
}