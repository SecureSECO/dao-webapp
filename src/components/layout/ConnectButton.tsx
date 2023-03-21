// import React, { Fragment, useEffect, useState } from 'react';
import { HiExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
//import type { ethers } from 'ethers';
// import { cn } from '@/src/lib/utils';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useDisconnect } from 'wagmi';
import { FaWallet } from 'react-icons/fa';

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
import { Button } from '@/src/components/ui/Button';

const ConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { chain } = useNetwork();

  let jazznumber = address ? jsNumberForAddress(address!) : 0;

  return address ? (
    <div className="flex items-center gap-x-3 text-slate-900">
      <div className="grid select-none gap-y-1.5 text-sm dark:text-gray-300">
        {/* TODO: possibly put address here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex rounded-full text-sm focus:outline-none">
          <span className="sr-only">Open wallet menu</span>
          <Jazzicon diameter={40} seed={jazznumber} />
          {chain?.id !== prefferedNetwork && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="absolute -top-2 -right-2">
                  <HiExclamationCircle className="text-xl text-primary drop-shadow-[0_0_8px_rgb(0,0,0)] dark:text-primary-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Incorrect Network</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>
            <div className="flex items-center justify-center gap-x-2">
              <Jazzicon diameter={24} seed={jazznumber} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className=" text-sm font-medium dark:text-gray-200">
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
              className="flex w-full items-center gap-x-2 text-sm dark:text-gray-300"
            >
              <HiOutlineLogout className="text-xl" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button
      onClick={() => open()}
      variant="outline"
      size="sm"
      className="gap-x-2"
      icon={FaWallet}
      label="Connect Wallet"
      //className="flex shrink-0 grow-0 items-center gap-x-2 rounded-md bg-primary-500 p-3 hover:bg-primary-800 lg:rounded-md lg:py-1.5 lg:px-4"
    ></Button>
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
