import Link from "next/link";
import React, { useState, useEffect, use } from 'react';
import type { NextPage } from "next";
import logo from '../public/logo.jpeg';
import Image from "next/image";
import axios from "axios";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
interface Deposit {
  depositor: string;
  commitment: string;
  tx_hash: string;
}
const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [merkleTreeRoot, setMerkleTreeRoot] = useState<string>("Unavailable");
  const [subsetMerkleRoot, setSubsetMerkleRoot] = useState<string>("Unavailable");
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          axios.get(
            (process.env.NEXT_PUBLIC_ASP_API_URL || "http://localhost:3002") + "/merkle-roots"
          )
            .then(response => {
              const merkleRoot = response?.data?.root;
              const subsetRoot = response?.data?.subRoot;
              if (merkleRoot && subsetRoot) {
                setMerkleTreeRoot(merkleRoot);
                setSubsetMerkleRoot(subsetRoot);
              }
            })
            .catch(error => {
              console.error(error);
            });
          axios.get(
            (process.env.NEXT_PUBLIC_ASP_API_URL || "http://localhost:3002") + "/deposits/sub-tree"
          )
            .then(response => {
              const deposits = response?.data?.deposits;
              if (deposits) {
                setDeposits(deposits);
              }
            })
            .catch(error => {
              console.error(error);
            });
        } catch (error) {
          throw error;
        }
      };
      fetchData();
      setMounted(true);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [subsetMerkleRoot, merkleTreeRoot]);

  if (!mounted) return <></>;
  return (
    <>
      <div className="flex items-center flex-col flex-grow ">
        <aside id="separator-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <Image
                    className="w-10 h-10 "
                    src={logo}
                    alt="Bitcoin Logo"
                  />
                  <span className="ms-3"><h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Legatus</span></h1></span>
                </a>
              </li>
              <li>
                <a href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Privacy Pool</span>
                  {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                </a>
              </li>
              <li>
                <a href="/asp" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">ASP</span>
                  {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
                </a>
              </li>
              <li>
                <a href="/groups" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Group</span>
                </a>
              </li>

              <li>
                <div className="flex items-center justify-center">
                  <button type="button" className=" text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-10 py-2.5 text-center mb-1">Create Deposit</button>
                </div>
              </li>
            </ul>
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                  </svg>
                  <a href="https://github.com/thomasacquin1225/Legatus" target="_blank"><span className="ms-3">GitHub</span></a>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                    <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z" />
                  </svg>
                  <span className="ms-3">Help</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="mr-40 ml-40 mt-2">
          <div className="flex justify-center flex">
            <div className="flex flex-col">
              <h4 className="text-2xl font-normal leading-normal mt-0 mb-2 text-blueGray-800">
                Merkle Tree root
              </h4>
              <CopyButton content={merkleTreeRoot} />
              <h4 className="text-2xl font-normal leading-normal mb-2 text-blueGray-800">
                Subset tree merkle root
              </h4>
              <CopyButton content={subsetMerkleRoot} />
            </div>  
          </div>

          <div className="pt-8">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Depositor</th>
                    <th>Commitment</th>
                    <th>Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit, index) => (
                    index % 3 === 0 && (
                      <tr key={index / 3}>
                        <th>{index / 3 + 1}</th>
                        <td key={index + 0}>{deposit?.depositor?.toString().substring(0,25)}...</td>
                        <td key={index + 1}>{deposit?.commitment?.toString().substring(0,30)}...</td>
                        <a href={`${getTargetNetwork()?.blockExplorers?.default?.url || ''}/tx/${deposit?.tx_hash?.toString()}`} target="_blank" rel="noreferrer noopener">
                          <td key={index + 2}>{deposit?.tx_hash?.toString().substring(0,32)}...</td>
                        </a>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div className="fixed bottom-8 right-0 mb-4 mr-4">
          <div className="chat chat-end ">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="chat-header opacity-50">
              Support
            </div>
            <div className="chat-bubble">Need any help?</div>
          </div>
        </div>

      </div>
    </>
  );
};

interface ClipboardProps {
  duration?: number;
}


const useClipboard = (props: ClipboardProps) => {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const resetCopy = React.useRef<NodeJS.Timeout | null>(null);

  const onCopy = React.useCallback(() => {
    if (ref.current) {
      navigator.clipboard
        .writeText(ref.current.innerText)
        .then(() => setCopied(true));
    }
  }, [ref]);

  React.useEffect(() => {
    if (copied) {
      resetCopy.current = setTimeout(
        () => setCopied(false),
        props?.duration || 3000,
      );
    }

    return () => {
      if (resetCopy.current) {
        clearTimeout(resetCopy.current);
      }
    };
  }, [copied, props.duration]);

  return { copied, ref, onCopy };
};

interface CopyButtonProps {
  content: string;
}
const CopyButton: React.FC<CopyButtonProps> = ({ content }) => {
  const { copied, ref, onCopy } = useClipboard({ duration: 4000 });

  return (
    <div >
      <div className="flex flex-row ">
        <div ref={ref} className="">
          <blockquote className="p-1 bg-gray-100 rounded dark:bg-gray-800">
            <p className="text italic leading-relaxed text-gray-900 dark:text-white">{content}</p>
          </blockquote>
        </div>
        <button className="ml-1" onClick={onCopy}>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-1">
        {copied ?
          <>
            <kbd className="kbd">CMD ⌘</kbd>
            /
            <kbd className="kbd">Ctrl</kbd>
            +
            <kbd className="kbd">V</kbd>
          </>
          :
          <></>}
      </div>
    </div>
  );
};

export default Home;

