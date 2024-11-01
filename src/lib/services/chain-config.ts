import RPC from '@/lib/rpc-list'


export const defaultChainId = 1320
export const INPUT_CHAIN_URL = RPC[defaultChainId][0]

export const CHAIN_TO_URL_MAP = {
  [1320]: RPC[defaultChainId][0],
}

type ChainInfo = {
  explorer: string
  label: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: 18
  }
  rpcUrl: string
}

export const CHAIN_INFO: { [key: string]: ChainInfo } = {
  1320: {
    explorer: 'https://testnet.aiascan.com',
    label: 'AIA Testnet',
    nativeCurrency: { name: 'AIA', symbol: 'AIA', decimals: 18 },
    rpcUrl: RPC[defaultChainId][0],
  },
}

// URLs
export const METAMASK_URL = 'https://metamask.io/download/'