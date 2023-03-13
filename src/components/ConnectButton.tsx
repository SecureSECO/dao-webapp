import React, { Fragment, useEffect, useState } from 'react';
import { HiExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
//import type { ethers } from 'ethers';
import { cn } from '@/src/lib/utils';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useDisconnect } from 'wagmi';

const ConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { chain } = useNetwork();

  let jazznumber = address ? jsNumberForAddress(address!) : 0;

  //address ? 

  return (
    <div className="flex items-center gap-x-3">
      <div className="grid select-none gap-y-1.5 text-sm text-gray-300">
        test
      </div>
    </div>
  );
  //    <Menu as="div" className="relative">
  //     <Menu.Button className="relative flex rounded-full text-sm focus:outline-none">
  //       <span className="sr-only">Open wallet menu</span>
  //       <Jazzicon diameter={40} seed={jazznumber} />
  //       {chain?.id !== 1 && (
  //         <Tippy
  //           content={'Not on Mainnet'}
  //           theme={'tooltip'}
  //           arrow={false}
  //           offset={[0, 6]}
  //           animation="scale"
  //         >
  //           <div className="absolute -top-2 -right-2">
  //             <HiExclamationCircle className="text-primary text-xl drop-shadow-[0_0_8px_rgb(0,0,0)]" />
  //           </div>
  //         </Tippy>
  //       )}
  //     </Menu.Button>
  //     <Transition
  //       as={Fragment}
  //       enter="transition ease-out duration-100"
  //       enterFrom="transform opacity-0 translate-y-1"
  //       enterTo="transform opacity-100 translate-y-0"
  //       leave="transition ease-in duration-75"
  //       leaveFrom="transform opacity-100 translate-y-0"
  //       leaveTo="transform opacity-0 translate-y-1"
  //     >
  //       <Menu.Items className="border-dark-200 bg-dark-600 absolute right-0 mt-2 w-48 origin-top rounded-md border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
  //         <Menu.Item disabled>
  //           <div className="border-dark-200 flex items-center gap-x-2 border-b px-4 py-3">
  //             <Jazzicon diameter={24} seed={jazznumber} />
  //             <Tippy
  //               content={address}
  //               theme={'tooltip'}
  //               arrow={false}
  //               offset={[0, 8]}
  //               animation="scale"
  //             >
  //               <p className=" text-sm font-medium text-gray-200">
  //                 {address?.slice(0, 5) + '...' + address?.slice(-4)}
  //               </p>
  //             </Tippy>
  //           </div>
  //         </Menu.Item>
  //         <Menu.Item>
  //           {({ active }) => (
  //             <button
  //               onClick={() => disconnect()}
  //               className={cn(
  //                 active ? 'bg-dark-200' : '',
  //                 'flex w-full items-center gap-x-2 px-4 py-2.5 text-sm text-gray-300'
  //               )}
  //             >
  //               <HiOutlineLogout className="text-lg" />
  //               <span>Sign Out</span>
  //             </button>
  //           )}
  //         </Menu.Item>
  //       </Menu.Items>
  //     </Transition>
  //   </Menu>
  // </div>
  // ) : (
  //   <button
  //     onClick={() => open()}
  //     className="bg-primary text-dark-400 hover:bg-primary-800 flex items-center gap-x-2 rounded-full px-3 py-1.5 lg:px-4"
  //   >
  //     <svg
  //       className="h-4 w-4"
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 512 512"
  //       fill="currentColor"
  //     >
  //       <path d="M448 32C465.7 32 480 46.33 480 64C480 81.67 465.7 96 448 96H80C71.16 96 64 103.2 64 112C64 120.8 71.16 128 80 128H448C483.3 128 512 156.7 512 192V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM416 336C433.7 336 448 321.7 448 304C448 286.3 433.7 272 416 272C398.3 272 384 286.3 384 304C384 321.7 398.3 336 416 336z" />
  //     </svg>
  //     <span className="hidden font-medium lg:inline">Connect Wallet</span>
  //   </button>
  // );
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
