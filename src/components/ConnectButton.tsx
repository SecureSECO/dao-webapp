// import React, { Fragment, useEffect, useState } from 'react';
import { HiExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
//import type { ethers } from 'ethers';
// import { cn } from '@/src/lib/utils';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useDisconnect } from 'wagmi';

const prefferedNetwork: number = 5; //137;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';

const ConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { chain } = useNetwork();

  let jazznumber = address ? jsNumberForAddress(address!) : 0;

  return address ? (
    <div className="flex items-center gap-x-3">
      <div className="grid select-none gap-y-1.5 text-sm text-gray-300">
        test
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex rounded-full text-sm focus:outline-none">
          <span className="sr-only">Open wallet menu</span>
          <Jazzicon diameter={40} seed={jazznumber} />
          {chain?.id !== prefferedNetwork && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="absolute -top-2 -right-2">
                  <HiExclamationCircle className="text-xl text-primary drop-shadow-[0_0_8px_rgb(0,0,0)]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Incorrect Network</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="">
          <DropdownMenuLabel>
            <div className="flex items-center gap-x-2 border-b border-gray-200 px-4 py-3">
              <Jazzicon diameter={24} seed={jazznumber} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="absolute -top-2 -right-2">
                    <p className=" text-sm font-medium text-gray-200">
                      {address?.slice(0, 5) + '...' + address?.slice(-4)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{address}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group">
            <button
              onClick={() => disconnect()}
              className="flex w-full items-center gap-x-2 px-4 py-2.5 text-sm text-gray-300"
            >
              <HiOutlineLogout className="text-lg" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <button
      onClick={() => open()}
      className="flex grow-0 items-center gap-x-2 rounded-full bg-primary px-3 py-1.5 text-gray-400 hover:bg-primary-800 lg:rounded-md lg:px-4"
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path d="M448 32C465.7 32 480 46.33 480 64C480 81.67 465.7 96 448 96H80C71.16 96 64 103.2 64 112C64 120.8 71.16 128 80 128H448C483.3 128 512 156.7 512 192V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM416 336C433.7 336 448 321.7 448 304C448 286.3 433.7 272 416 272C398.3 272 384 286.3 384 304C384 321.7 398.3 336 416 336z" />
      </svg>
      <span className="hidden font-medium lg:inline">Connect Wallet</span>
    </button>
  );
};

export default ConnectButton;

// type BalanceIconProps = {
//   name: string
//   balance: string | null | undefined
//   network?: ethers.providers.Network | null | undefined
//   isLoading: boolean
// }

// const BalanceIcon = ({ name, balance, isLoading }: BalanceIconProps) => {
//   const { chain } = useNetwork()

//   return (
//     <div className="flex items-center gap-x-1">
//       <Tippy
//         content={`${name} Balance`}
//         theme={'tooltip'}
//         arrow={false}
//         offset={[0, 6]}
//         animation="scale"
//       >
//         <span className="flex flex-shrink-0 cursor-help">
//           <Image
//             src={`/ethIcons/${name.toLowerCase()}.svg`}
//             alt={`${name} icon`}
//             width={16}
//             height={16}
//           />
//         </span>
//       </Tippy>
//       <p className="font-medium leading-none">
//         {/* {network?.chainId === 1 ? balance?.toFixed(2) : "-"} */}
//         {chain?.id === 1 ? (isLoading ? 'Loading...' : balance) : '-'}
//       </p>
//     </div>
//   )
// }

// const Balances = () => {
//   const { address } = useAccount()
//   const [ethBal, setEthBal] = useState<string>('')
//   const [wethBal, setWethBal] = useState<string>('')

//   const { data, isLoading } = useBalance({
//     address,
//     formatUnits: 'ether',
//   })

//   const { data: wethData, isLoading: wethIsLoading } = useBalance({
//     address,
//     formatUnits: 'ether',
//     token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//   })

//   useEffect(() => {
//     if (!isLoading) {
//       setEthBal(parseFloat(data?.formatted!).toFixed(2))
//     }
//     if (!wethIsLoading) {
//       setWethBal(parseFloat(wethData?.formatted!).toFixed(2))
//     }
//   }, [address, isLoading, wethIsLoading])
//   return (
//     <>
//       <BalanceIcon name="ETH" balance={ethBal} isLoading={isLoading} />
//       <BalanceIcon name="WETH" balance={wethBal} isLoading={wethIsLoading} />
//     </>
//   )
// }
