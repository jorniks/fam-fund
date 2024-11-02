
export type FamilyType = {
  name: string,
  creator: string,
  creatorName: string,
  familyAddress: string,
  creationDate: number,
  walletBalance: number,
  members: FamilyMember[],
  proposals: FamilyProposals[],
  thresholdValues: ThresholdValues[]
}

export type FamilyMember ={
  name: string,
  addr: string,
  role: string
}

export type FamilyProposals = {
  proposer: string,
  proposerName: string,
  title: string,
  description: string,
  amount: number,
  recipient: string,
  votesFor: number,
  votesAgainst: number,
  endDate: number,
  allowedVoters: [],
  forPercentage: number,
  againstPercentage: number,
  status: string,
  executed: boolean
}

export type ThresholdValues = {
  lowAmount: number,
  mediumAmount: number,
  highAmount: number
}

export type FamilyMemberType = {
  name: string,
  string: string
}