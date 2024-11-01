import { Contract } from '@ethersproject/contracts';
import { ZeroAddress } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { getContract } from './contract/contracts';
import { useMemo } from 'react';
import { CONTRACT_ADDRESS } from '@/constants/contract-address';
import CONTRACT_ABI from '@/constants/abi.json';

export const useContract = (): Contract | null => {
  const contractAddress = CONTRACT_ADDRESS;
  const { account, provider } = useWeb3React();
  
  const contract = useMemo(() => {
    if (!contractAddress || contractAddress === ZeroAddress || !CONTRACT_ABI || !provider) return null;

    return getContract(contractAddress, CONTRACT_ABI, provider, account);
  }, [contractAddress, provider, account]);

  return contract;
};
