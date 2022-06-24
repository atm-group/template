import { ethers } from 'ethers';
import { ERC20_ABI } from '../src/static/abi/erc20';

/**
 * check address correct
 * @param value 
 * @returns 
 */
export function isAddress(value: string) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

/**
 * format user account
 * @param account 
 * @returns 
 */
export const parseAccount = (account: string) => {
  if (isAddress(account)) {
    return account.substr(0, 6) + '....' + account.substr(-4);
  }
  
  return account;
}

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export const chainParams: Record<string, AddEthereumChainParameter> = {
  'rinkeby': {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'eth',
      symbol: 'eth',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
  'kovan': {
    chainId: '0x2a',
    chainName: 'kovan',
    nativeCurrency: {
      name: 'eth',
      symbol: 'eth',
      decimals: 18,
    },
    rpcUrls: ['https://kovan.infura.io/v3/'],
    blockExplorerUrls: ['https://kovan.etherscan.io'],
  },
  'bsc': {
    chainId: '0x38',
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  'bnbt': {
    chainId: '0x61',
    chainName: 'bnbt',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  }
}

/**
 * call ethereum change net
 * @param netWorkInfo 
 */
export const changeNetwork = async (netWorkInfo: AddEthereumChainParameter) => {
  if (!(window as any).ethereum) {
    alert('No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.')
    throw ('no window.ethereum');
  }
  try {
    if (netWorkInfo.chainId === '0x1' || netWorkInfo.chainId === '0x4' || netWorkInfo.chainId === '0x2a') {
      await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: netWorkInfo.chainId
          },
        ],
      })
    } else {
      await (window as any).ethereum.request({ method: 'wallet_addEthereumChain', params: [netWorkInfo]});
    }
  } catch (e) {
    throw `connect error, netWorkInfo: ${netWorkInfo.chainId}, ${JSON.stringify(e)}`;
  }
}

/**
 * get account balance
 * @param library 
 * @param account 
 * @returns 
 */
export const getBalance = async (library: ethers.providers.Web3Provider, account: string) => {
  let balance = await library?.getBalance(account);

  return ethers.utils.formatEther(balance);
}

/**
 * create contract instance
 * @param account 
 * @param abi 
 * @param provider 
 * @returns 
 */
export const getContract = (account: string, abi: ethers.ContractInterface, provider: ethers.providers.BaseProvider) => {
  return new ethers.Contract(account, abi, provider);
}

/**
 * get erc20 balance
 * @param tokenAddress 
 * @param account 
 * @param library 
 * @returns 
 */
export const getTokenBalance = async (tokenAddress: string, account: string, library: ethers.providers.Web3Provider, fixed = 4) => {
  if (!isAddress(tokenAddress) || !isAddress(account)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }
  const contract = getContract(tokenAddress, ERC20_ABI, library); 
  try {
    const balance = await contract.balanceOf(account);
    const decimals = await contract.decimals();
    if (fixed) {
      return parseFloat(ethers.utils.formatUnits(balance, decimals)).toFixed(4);
    }
    return parseFloat(ethers.utils.formatUnits(balance, decimals));
  } catch (e) {
    e.code = 'ERROR_CODES.getTokenBalance';
    throw e;
  }
}

/**
 * get user allowance
 * @param contractAddress 
 * @param provider 
 * @param owner 
 * @param spender 
 * @returns 
 */
export const getERC20Allowance = async (contractAddress: string, provider: ethers.providers.Web3Provider, owner: string, spender: string) => {
  const contract = getContract(contractAddress, ERC20_ABI, provider);
  const decimals = await contract.decimals();
  const allowance = await contract.allowance(owner, spender);

  return parseFloat(ethers.utils.formatUnits(allowance, decimals));
}

/**
 * erc20 approve
 * @param contractAddress 
 * @param provider 
 * @param owner 
 * @param spender 
 * @param amount 
 * @returns 
 */
export const erc20Approve = async (
  contractAddress: string, 
  provider: ethers.providers.Web3Provider,
  owner: string, 
  spender: string, 
  amount = ethers.constants.MaxUint256.toString()
) => {
  const contract = getContract(contractAddress, ERC20_ABI, provider);
  const contractWithSigner = contract.connect(provider.getSigner(owner));
  return contractWithSigner.approve(spender, amount);
}

/**
 * format event
 * @param abi 
 * @param logs 
 * @returns 
 */
export const parseLog = (abi: any, logs: ethers.Event []) => {
  const iface = new ethers.utils.Interface(abi);
  return logs.map((log) => {
    try {
      return iface.parseLog(log)
    } catch (e) {
      return null;
    }
  })
}
