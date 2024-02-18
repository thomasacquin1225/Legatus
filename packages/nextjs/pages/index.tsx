import Link from "next/link";
import { useState, useEffect } from 'react';
import type { NextPage } from "next";
import logo from '../public/logo.jpeg';
import Image from "next/image";
import React from "react";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import { ethers } from 'ethers';
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
const { buildPoseidonOpt } = require('circomlibjs');

interface IHashPaths {
  tree: {
    root: string;
    index: number;
    hashPath: string[];
  };
  subTree: {
    root: string;
    index: number;
    hashPath: string[];
  };
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedTokenDeposit, setSelectedTokenDeposit] = useState("");
  const [selectedTokenWithdraw, setSelectedTokenWithdraw] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [privateNote, setPrivateNote] = useState<string>("0x");
  const [commitmentNote, setCommitmentNote] = useState<string>("0x");
  const [merkleRoot, setMerkleRoot] = useState<string>("0x");
  const [subMerkleRoot, setSubMerkleRoot] = useState<string>("0x");
  const [isChecked, setIsChecked] = useState(false);

  const { writeAsync: depositTx, isLoading: depositLoading, isMining: depositMining } = useScaffoldContractWrite({
    contractName: "PrivacyPool",
    functionName: "deposit",
    args: [
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      parseEther(depositAmount.toString()),
      privateNote?.slice(0, 66) as `0x${string}`,
    ],
    value: depositAmount.toString() as `${number}`,
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: withdrawTx, isLoading: withdrawLoading, isMining: withdrawMining } = useScaffoldContractWrite({
    contractName: "PrivacyPool",
    functionName: "withdraw",
    args: [
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      connectedAddress,
      parseEther(withdrawAmount.toString()),
      '0x',
      '0x',
      subMerkleRoot as `0x${string}`,
      '0x',
      '0x',
    ],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const actualDeposit = async () => {
    setLoading(true);
    try {
      setLoadingText("Submitting deposit transaction...");
      await depositTx();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    closeDeposit();
  };

  const actualWithdraw = async () => {
    setLoading(true);
    try {
      if (commitmentNote?.length !== 194) {
        throw new Error('Invalid note length');
      }
      const commitment = commitmentNote?.slice(0, 66);
      const secretHash = '0x' + commitmentNote?.slice(66, 130);
      const nullifierHash = '0x' + commitmentNote?.slice(130, 194);
      const hashPaths = await getHashPath(commitment);
      setLoadingText("Generating merkle proof...");
      const proof1 = await generateProof(
        secretHash,
        nullifierHash,
        commitment,
        hashPaths?.tree?.root,
        hashPaths?.tree?.hashPath,
        hashPaths?.tree?.index?.toString()
      );
      setLoadingText("Generating subtree merkle proof...");
      const proof2 = await generateProof(
        secretHash,
        nullifierHash,
        commitment,
        hashPaths?.subTree?.root,
        hashPaths?.subTree?.hashPath,
        hashPaths?.subTree?.index?.toString()
      );
      setLoadingText("Submitting withdraw transaction...");
      await withdrawTx({
        args: [
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          connectedAddress,
          parseEther(withdrawAmount.toString()),
          nullifierHash as `0x${string}`,
          hashPaths?.tree?.root as `0x${string}`,
          hashPaths?.subTree?.root as `0x${string}`,
          proof1 as `0x${string}`,
          proof2 as `0x${string}`,
        ],
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const openDeposit = () => {
    setIsDepositOpen(true);
  };

  const closeDeposit = () => {
    setIsDepositOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTokenSelectDeposit = (token: string) => {
    setSelectedTokenDeposit(token);
    setIsModalOpen(false);
  };

  const handleTokenSelectDropDeposit = (token: string) => {
    setSelectedTokenDeposit(token);
    setIsModalOpen(false);
    toggleDropdown();
  };

  const handleTokenSelectWithdraw = (token: string) => {
    setSelectedTokenWithdraw(token);
    setIsModalOpen(false);
  };

  const handleTokenSelectDropWithdraw = (token: string) => {
    setSelectedTokenWithdraw(token);
    setIsModalOpen(false);
    toggleDropdown();
  };


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleAction = async (tab: string) => {
    if (tab === "deposit") {
      await generateCommitment();
      openDeposit();
    }
    else if (tab === "withdraw") {
      await actualWithdraw();
    }
  }

  const poseidonHash = async (data: any[]) => {
    const poseidon = await buildPoseidonOpt();
    const posHash = poseidon(data);
    const hash = poseidon.F.toString(posHash);
    let hexString = ethers.toBigInt(hash).toString(16);
    while (hexString.length < 64) {
      hexString = '0' + hexString;
    }
    return '0x' + hexString;
  }

  const generateCommitment = async () => {
    try {
      const range = 9007199254740990;
      const secret = BigInt(Math.floor(Math.random() * range));
      const nullifier = secret + BigInt(1);
      const secretHash = await poseidonHash([secret.toString()]);
      const nullifierHash = await poseidonHash([nullifier.toString()]);
      const commitment = await poseidonHash([secretHash, nullifierHash]);
      const note = commitment + secretHash.slice(2) + nullifierHash.slice(2);
      setPrivateNote(note);
    } catch (error) {
      console.log(error);
    }
  }

  const getHashPath = async (commitment: string): Promise<IHashPaths> => {
    try {
      const response = await axios.get(
        (process.env.NEXT_PUBLIC_ASP_API_URL || "http://localhost:3002") + "/hash-path/" + commitment
      );
      const hashPaths: IHashPaths = response?.data;
      return hashPaths;
    } catch (error) {
      console.log(error);
      return {} as IHashPaths;
    }
  }

  const generateProof = async (secret: string, nullifier: string, leaf: string, root: string, hashPath: string[], index: string) => {
    try {
      const sindriApi = axios.create({
        baseURL: process.env.NEXT_PUBLIC_SINDRI_API_URL || "https://sindri.app/api/v1",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SINDRI_API_KEY || "API-KEY"}`
        },
        validateStatus: (status) => status >= 200 && status < 300
      });
      const hash_path = [...hashPath, ...Array(Math.max(0, 10 - hashPath.length)).fill('0')];
      const hashPathString = hash_path.map(value => `"${value}"`).join(",");

      const data = `
          hash_path=[${hashPathString}]
          index="${index}"
          leaf="${leaf}"
          nullifier="${nullifier}"
          root="${root}"
          secret="${secret}"
      `;

      const proofInput = data;
      const circuitId = process.env.NEXT_PUBLIC_SINDRI_CIRCUIT_ID || "5defe5f6-7eb5-47e7-a59b-07f3beb97754";
      const proveResponse = await sindriApi.post(`/circuit/${circuitId}/prove`, {
        proof_input: proofInput,
      });
      const proofId = proveResponse.data.proof_id;

      let startTime = Date.now();
      let proofDetailResponse;
      while (true) {
        proofDetailResponse = await sindriApi.get(`/proof/${proofId}/detail`);
        const { status } = proofDetailResponse.data;
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
        if (status === "Ready") {
          break;
        } else if (status === "Failed") {
          throw new Error(
            `Polling failed after ${elapsedSeconds} seconds: ${proofDetailResponse.data.error}.`,
          );
        } else if (Date.now() - startTime > 30 * 60 * 1000) {
          throw new Error("Timed out after 30 minutes.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      return '0x' + proofDetailResponse?.data?.proof?.proof;
    } catch (error) {
      console.log(error);
    }
  }

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
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
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

        <div className="ml-44 ">
          <div className="flex justify-center flex-col items-center">
            <p className="light:text-black flex font-bold text-3xl dark:text-white-200">Protocol :
              <img
                className="w-10 h-10 ml-2 "
                src="https://cryptologos.cc/logos/aave-aave-logo.svg?v=029"
                alt="Aave Logo"
              />
            </p>
            <div className="flex justify-center flex">
              <div className="bg-primary p-3 rounded-full">
                <button type="button" onClick={() => setActiveTab('deposit')} className="btn text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-1 dark:bg-gray-100 dark:hover:bg-gray-200 dark:focus:ring-gray-700 dark:border-gray-700">Deposit</button>

                <button type="button" onClick={() => setActiveTab('withdraw')} className="btn text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-1 dark:bg-gray-100 dark:hover:bg-gray-200 dark:focus:ring-gray-700 dark:border-gray-700">Withdraw</button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-main-container mt-4">
              {
                activeTab === 'deposit' ?
                  <div className="h-large-div bg-gray-800 mb-4 rounded">
                    <div className="flex flex-row">
                      <div className="basis-1/2">
                        <p className="light:text-black font-bold text-4xl pt-3 pl-4 dark:text-white-200">Deposit collateral</p>
                      </div>
                      <div className="basis-1/2 flex items-center justify-end mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                          <path stroke-linecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                    </div>
                    <form className="pt-4">
                      <div className="relative px-2 flex">
                        <input type="text" placeholder="Enter amount" className="input text-xl font-bold input-ghost w-2/3 text-bold"
                          onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
                        />
                        <div>
                          <button
                            id="dropdownHoverButton"
                            className="pl-12 mx-10 text-black text-1xl bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-500 font-bold rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-100"
                            type="button"
                            style={{ width: '200px' }}
                            onClick={toggleDropdown}
                          >
                            {selectedTokenDeposit ? selectedTokenDeposit : "Select token"}
                            {
                              selectedTokenDeposit === "ETH" ?
                                <img
                                  className="w-6 h-6 ml-4 "
                                  src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
                                  alt="Eth Logo"
                                />
                                : selectedTokenDeposit === "WBTC" ?
                                  <img
                                    className="w-6 h-6 ml-4 "
                                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029"
                                    alt="UNIswap Logo"
                                  />
                                  : selectedTokenDeposit === "USDC" ?
                                    <img
                                      className="w-6 h-6 ml-4 "
                                      src="https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg?v=029"
                                      alt="UNIswap Logo"
                                    />
                                    : selectedTokenDeposit === "USDT" ?
                                      <img
                                        className="w-6 h-6 ml-4 "
                                        src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029"
                                        alt="USDT Logo"
                                      />
                                      : selectedTokenDeposit === "UNI" ?
                                        <img
                                          className="w-6 h-6 ml-4 "
                                          src="https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=029"
                                          alt="UNIswap Logo"
                                        />
                                        :
                                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                            }
                          </button>
                          {isOpen && (
                            <div
                              id="dropdownHover"
                              className="z-1 absolute w-52 mx-10 z-1 bg-white divide-y rounded-lg shadow dark:bg-gray-700 mx-10 z-10 bg-white divide-y rounded-lg shadow  dark:bg-gray-700"
                            >
                              <ul className="py-2 text text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                                <li>
                                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleTokenSelectDropDeposit("ETH")}>ETH</a>
                                </li>
                                <li>
                                  <a  aria-disabled className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >UNISwap</a>
                                </li>
                                <li>
                                  <a aria-disabled className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >WBTC</a>
                                </li>
                                <li>
                                  <a  aria-disabled className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >USDC</a>
                                </li>
                                <li>
                                  <a  aria-disabled className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >USDT</a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-row">
                        <div className="flex justify-end items-end mt-4">
                          <div className="flex">
                            <p className="font-bold text-white pt-3"><Balance address={connectedAddress} /></p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  :
                  <div className="h-large-div-withdraw bg-gray-800 mb-4 rounded">
                    <div className="flex flex-row justify-between">
                      <div className="basis-1/2">
                        <p className="light:text-black font-bold text-4xl pt-1 pl-4 dark:text-white-200">Withdraw Aave aToken</p>
                      </div>
                      <div className="basis-1/2 flex items-center justify-end mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                          <path stroke-linecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                    </div>
                    <form className="pt-4">
                      <div className="relative px-2">
                        <div className="relative px-2 flex">
                          <input type="text" placeholder="Enter amount" className="input text-xl input-ghost w-2/3 text-bold text-lg font-bold"
                            onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                          />
                          <div>
                            <button
                              id="dropdownHoverButton"
                              className="pl-12 mx-10 text-black text-1xl bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-500 font-bold rounded-lg px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-100"
                              type="button"
                              style={{ width: '200px' }}
                              onClick={toggleDropdown}
                            >
                              {selectedTokenWithdraw ? selectedTokenWithdraw : "Select token"}
                              {
                                selectedTokenWithdraw === "aEthWETH" ?
                                  <img
                                    className="w-6 h-6 ml-4 "
                                    src="https://seeklogo.com/images/C/compound-ether-ceth-logo-1946B97AC4-seeklogo.com.png"
                                    alt="WEth Logo"
                                  />
                                  : selectedTokenWithdraw === "WBTC" ?
                                    <img
                                      className="w-6 h-6 ml-4 "
                                      src="https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg?v=029"
                                      alt="UNIswap Logo"
                                    />
                                    : selectedTokenWithdraw === "UNI" ?
                                      <img
                                        className="w-6 h-6 ml-4 "
                                        src="https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=029"
                                        alt="UNIswap Logo"
                                      />
                                      :
                                      <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                      </svg>
                              }
                            </button>
                            {isOpen && (
                              <div
                                id="dropdownHover"
                                className="absolute mx-10 z-1 bg-white divide-y rounded-lg shadow dark:bg-gray-700"
                                style={{ width: '200px' }}
                              >
                                <ul className="py-2 text text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                                  <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleTokenSelectDropWithdraw("aEthWETH")}>aEthWETH</a>
                                  </li>
                                  <li>
                                    <a  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >aEthWBTC</a>
                                  </li>
                                  <li>
                                    <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >aEthUSDC</a>
                                  </li>
                                  <li>
                                    <a  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white opacity-60" >aEthUSDT</a>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mb-6 mt-2">
                        <label className="ml-5 block mb-2 text-lg font-medium text-gray-900 dark:text-white">Commitment note</label>
                        <div className="ml-5 mr-5">
                          <input type="text" id="large-input" placeholder="Commitment note" className="block w-full p-6 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                            onChange={(e) => setCommitmentNote(e.target.value)}
                          />
                        </div>
                      </div>

                      <div >
                        <label className="ml-5 block mb-2 text-lg font-medium text-gray-900 dark:text-white">Subset tree Merkle root</label>
                        <div className="ml-5 mr-5">
                          <input type="text" id="default-input" placeholder="Subset tree Merkle root" className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                            onChange={(e) => setSubMerkleRoot(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex-row">
                        <div className="flex justify-end items-end mt-1 mr-2 p">
                          <div className="flex">
                            <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-3 py-2  mb-2 ml-4 mt-2 dark:bg-gray-800 dark:text-white text-bold dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Max</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
              }

            </div>
          </div>
          <div className={` flex flex-col fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 ${(loading || depositLoading || withdrawLoading) ? '' : 'hidden'}`}>
            <p className="text-xl font-bold">{loadingText}</p>
            <HashLoader
              color="#ffffff"
              size="100px"
              loading={loading || depositLoading || withdrawLoading} />
          </div>
          <div className="mt-4 rounded">
            <button className="btn w-full" onClick={() => (activeTab === "deposit" && selectedTokenDeposit) ? handleAction(activeTab) : (activeTab === "withdraw" && selectedTokenWithdraw) ? handleAction(activeTab) : openModal()}>
              <svg
                className="w-4 h-4 me-2 -ms-1 text-[#626890]"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="ethereum"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                ></path>
              </svg>
              {(selectedTokenDeposit || selectedTokenWithdraw) ? ((activeTab === 'deposit' && selectedTokenDeposit) ? 'Deposit' : (activeTab === 'withdraw' && selectedTokenWithdraw) ? 'Withdraw' : 'Select a Token') : 'Select a Token'}
            </button>
          </div>
          <div>

            {isModalOpen && (
              <div id="default-modal" tabIndex={-1} className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center ">
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between md:p-3 rounded-t">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Select a Token
                      </h3>
                      <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                      </div>
                      <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ETH, Uniswap..." required />
                      <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                      {(selectedTokenDeposit || selectedTokenWithdraw) && (
                        <div className="flex items-center justify-between">
                          <h3 className="text font-semibold text-gray-900 dark:text-white">
                            Selected Token:
                          </h3>
                          <span className="text-gray-700 dark:text-gray-300">{activeTab === "deposit" ? selectedTokenDeposit : selectedTokenWithdraw}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text font-semibold text-gray-900 dark:text-white">
                          Popular tokens
                        </h3>
                        <a>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </a>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 ">
                          {
                            activeTab === "deposit" ?
                              <div>
                                <button onClick={() => { handleTokenSelectDeposit("ETH") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
                                    alt="Eth Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start ">
                                    Ethereum
                                    <span className="text-sm text-gray-400">ETH</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectDeposit("WBTC") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg?v=029"
                                    alt="UNIswap Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    Wrapped Bitcoin
                                    <span className="text-sm text-gray-400">WBTC</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectDeposit("USDC") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029"
                                    alt="USDC Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    USDC
                                    <span className="text-sm text-gray-400">USDC</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectDeposit("USDT") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029"
                                    alt="USDt Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    USDT
                                    <span className="text-sm text-gray-400">USDT</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectDeposit("UNI") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=029"
                                    alt="UNIswap Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    Uniswap
                                    <span className="text-sm text-gray-400">UNI</span>
                                  </div>
                                </button>
                              </div>
                              :
                              <div>
                                <button onClick={() => { handleTokenSelectWithdraw("aEthWETH") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
                                    alt="Eth Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start ">
                                    Aave Ethereum WETH
                                    <span className="text-sm text-gray-400">aEthWETH</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectWithdraw("aEthWBTC") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg?v=029"
                                    alt="UNIswap Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    Aave Ethereum Wrapped Bitcoin
                                    <span className="text-sm text-gray-400">aEthWBTC</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectWithdraw("aEthUSDC") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029"
                                    alt="USDC Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    Aave Etherum USDC
                                    <span className="text-sm text-gray-400">aEthUSDC</span>
                                  </div>
                                </button>
                                <button disabled onClick={() => { handleTokenSelectWithdraw("aEthUSDT") }} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white opacity-60">
                                  <img
                                    className="w-6 h-6 me-2.5 "
                                    src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029"
                                    alt="USDt Logo"
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    Aave Etherum USDT
                                    <span className="text-sm text-gray-400">aEthUSDT</span>
                                  </div>
                                </button>
                              </div>
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {isDepositOpen && (
              <div id="default-modal" tabIndex={-1} className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center ">
                <div className="absolute inset-0 bg-black opacity-80"></div>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between md:p-3 rounded-t">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Private Note
                      </h3>
                      <button onClick={closeDeposit} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                      </button>
                    </div>
                    <hr className="h-px bg-gray-200 dark:bg-gray-100"></hr>
                    <div className="px-4 md:p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text  text-gray-900 dark:text-white">
                          Please backup your note. You will need it later to withdraw your deposit back.
                          Treat your note as a private key - never share it with anyone, including Legatus developers.
                        </h3>
                        <a>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </a>
                      </div>
                      <div className="mr-3">
                        <CopyButton content={privateNote} />
                      </div>
                      <div>
                        <div className="mt-8">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                            />
                            <span className="ml-2 text-white">I backed up the note. </span>
                          </label>
                        </div>
                        <button
                          className={`mt-4 px-4 py-2 btn w-full ${isChecked ? '' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!isChecked}
                          onClick={actualDeposit}
                        >
                          Deposit
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

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
    <div className="">
      <div className="flex flex-row ">
        <div ref={ref} className="w-full md:w-98">
          <blockquote className=" bg-gray-100 rounded dark:bg-gray-800">
            <p className="text italic leading-relaxed text-gray-900 whitespace-normal break-words dark:text-white">{content}</p>
          </blockquote>
        </div>
        <button className="" onClick={onCopy}>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
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
              className="w-6 h-6"
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
      <div className="mb-2">
        {copied ?
          <>
            <kbd className="kbd">CMD ⌘</kbd>
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
