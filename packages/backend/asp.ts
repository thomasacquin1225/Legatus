import { PoseidonMerkleTree } from "./merkletree";
import { BytesLike, ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const { buildPoseidonOpt } = require('circomlibjs');
const PrivacyPool = require("./abis/PrivacyPool.json");
const ASP = require("./abis/ASP.json");


dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string);

app.use(cors());
app.use(express.json());

let provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
let wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x', provider);
let privacyPool = new ethers.Contract(process.env.PRIVACY_POOL_CONTRACT || '0x', PrivacyPool.abi, provider);
let asp = new ethers.Contract(process.env.ASP_CONTRACT || '0x', ASP.abi, provider);

let poseidon: any;
let merkleTree: PoseidonMerkleTree;
let subMerkleTree: PoseidonMerkleTree;

function reconnectProvider() {
    let interval = setInterval(() => {
        provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x', provider);
        privacyPool = new ethers.Contract(process.env.PRIVACY_POOL_CONTRACT || '0x', PrivacyPool.abi, provider);
        asp = new ethers.Contract(process.env.ASP_CONTRACT || '0x', ASP.abi, provider);
        provider.getBlockNumber()
            .then(() => {
                console.log('Successfully reconnected to RPC');
                startup();
                clearInterval(interval);
            })
            .catch(err => {
                console.log('Error while trying to reconnect:', err);
            });
    }, 5000);
}

async function startup() {
    try {
        poseidon = await buildPoseidonOpt();
        merkleTree = new PoseidonMerkleTree(poseidon);
        subMerkleTree = new PoseidonMerkleTree(poseidon);

        const { data: deposits, error } = await supabase.from('deposits').select('*');
        if (error) {
            throw(error);
        }
        const { data: excludedDepositors, error: error2 } = await supabase.from('excluded-depositors').select('*');
        if (error2) {
            throw(error2);
        }

        if (deposits && deposits?.length > 0) {
            merkleTree.buildMerkleTree(deposits.map((d: any) => d.commitment));
            if (excludedDepositors && excludedDepositors?.length > 0) {
                console.log('Excluded', excludedDepositors.map((d: any) => d?.depositor).length, 'suspicious depositor(s)');
                const excludedDepositorsList = excludedDepositors.map((d: any) => d?.depositor.toLowerCase());
                const excludedCommitments = deposits.filter((d: any) => excludedDepositorsList.includes(d?.depositor?.toLowerCase()))
                                                .map((d: any) => d.commitment);
                const filteredCommitments = deposits.map((d: any) => d.commitment).filter((c: string) => !excludedCommitments.includes(c));
                if (filteredCommitments.length > 0) {
                    subMerkleTree.buildMerkleTree(filteredCommitments);
                }
            } else {
                subMerkleTree.buildMerkleTree(deposits.map((d: any) => d.commitment));
            }
        }
        
        privacyPool.addListener('Deposit', async (depositor: string, asset: string, amount: bigint, commitment: string, event: any) => {
            try {
                const tx_hash = event?.log?.transactionHash;
                merkleTree.insert(commitment);
                subMerkleTree.insert(commitment);
                console.log('Inserted new commitment:', commitment);

                const tx1 = await (asp as any).connect(wallet).publishMerkleRoot(merkleTree.getRoot() as BytesLike);
                await tx1.wait();
                console.log('Published new merkle root on-chain:', merkleTree.getRoot());
                
                setTimeout(async () => {
                    const tx2 = await (asp as any).connect(wallet).publishSubMerkleRoot(
                        merkleTree.getRoot() as BytesLike, subMerkleTree.getRoot() as BytesLike
                    );
                    await tx2.wait();
                    console.log('Published new sub merkle root on-chain:', subMerkleTree.getRoot());
                }, 10000);

                const { data, error } = await supabase.from('deposits').insert([
                    { depositor: depositor.toLowerCase(), tx_hash, asset, amount: parseFloat(ethers.formatEther(amount)), commitment }
                ]);
                if (error) {
                    throw(error);
                }
            } catch (e) {
                console.error(e);
            }
        });
        console.log('Started Association Set Provider (ASP) server');
        console.log('Listening for new deposits on', (await provider.getNetwork()).chainId);
    } catch (e) {
        console.error(e);
    }
};

startup();

app.get('/merkle-root', async (req, res) => {
    try {
        const root = merkleTree.getRoot();
        res.status(200).json({ root });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/sub-merkle-root', async (req, res) => {
    try {
        const root = subMerkleTree.getRoot();
        res.status(200).json({ root });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/merkle-roots', async (req, res) => {
    try {
        const root = merkleTree.getRoot();
        const subRoot = subMerkleTree.getRoot();
        res.status(200).json({ root, subRoot });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/merkle-tree', async (req, res) => {
    try {
        const tree = merkleTree.getTree();
        res.status(200).json({ tree });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/sub-merkle-tree', async (req, res) => {
    try {
        const tree = subMerkleTree.getTree();
        res.status(200).json({ tree });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/hash-path/:commitment', async (req, res) => {
    try {
        const { commitment } = req.params;
        const root = merkleTree.getRoot();
        const treeIndex = merkleTree.getTreeIndex(commitment as string);
        const treePath = merkleTree.getPath(commitment as string);

        const subRoot = subMerkleTree.getRoot();
        const subTreeIndex = subMerkleTree.getTreeIndex(commitment as string);
        const subTreePath = subMerkleTree.getPath(commitment as string);
        res.status(200).json({ 
            tree: {root: root, index: treeIndex, hashPath: treePath}, 
            subTree: {root: subRoot, index: subTreeIndex, hashPath: subTreePath},
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/deposits', async (req, res) => {
    try {
        const { data: deposits, error } = await supabase.from('deposits').select('*');
        if (error) {
            throw(error);
        }
        res.status(200).json({ deposits });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/deposit/:commitment', async (req, res) => {
    try {
        const { commitment } = req.params;
        const { data: deposit, error } = await supabase.from('deposits').select('*').eq('commitment', commitment);
        if (error) {
            throw(error);
        }
        res.status(200).json({ deposit });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/deposits/sub-tree', async (req, res) => {
    try {
        const { data: deposits, error } = await supabase.from('deposits').select('*');
        if (error) {
            throw(error);
        }
        if (deposits) {
            const subtree = subMerkleTree.getTree();
            const subtreeDeposits = deposits.filter((d: any) => subtree.includes(d.commitment));
            res.status(200).json({ deposits: subtreeDeposits });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.get('/excluded-depositors', async (req, res) => {
    try {
        const { data: depositors, error } = await supabase.from('excluded-depositors').select('*');
        if (error) {
            throw(error);
        }
        const excludedDepositors = depositors.map((d: any) => d.depositor);
        res.status(200).json({ depositors: excludedDepositors });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.post('/add-deposit', async (req, res) => {
    try {
        const { depositor, tx_hash, asset, amount, commitment, publish } = req.body;
        if (publish === true) {
            merkleTree.insert(commitment);
            subMerkleTree.insert(commitment);
            console.log('Inserted new commitment:', commitment);

            const tx1 = await (asp as any).connect(wallet).publishMerkleRoot(merkleTree.getRoot() as BytesLike);
            await tx1.wait();
            console.log('Published new merkle root on-chain:', merkleTree.getRoot());
            const tx2 = await (asp as any).connect(wallet).publishSubMerkleRoot(
                merkleTree.getRoot() as BytesLike, subMerkleTree.getRoot() as BytesLike
            );
            await tx2.wait();
            console.log('Published new sub merkle root on-chain:', subMerkleTree.getRoot());
        }
        const { data, error } = await supabase.from('deposits').insert([
            { depositor: depositor.toLowerCase(), tx_hash, asset, amount, commitment }
        ]);
        if (error) {
            throw(error);
        }
        res.status(200).json({ message: 'Deposit added' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.post('/exclude-depositor', async (req, res) => {
    try {
        const { depositor } = req.body;
        const { data: deposits, error } = await supabase.from('deposits').select('*').eq('depositor', depositor.toLowerCase());
        if (error) {
            throw(error);
        }
        if (deposits && deposits.length > 0) {
            let subtree = subMerkleTree.getTree();
            const commitments = deposits.map((d: any) => d.commitment);
            subtree = subtree.filter((c: string) => !commitments.includes(c));           
            subMerkleTree = new PoseidonMerkleTree(poseidon);
            subMerkleTree.buildMerkleTree(subtree);
            const tx = await (asp as any).connect(wallet).publishSubMerkleRoot(
                merkleTree.getRoot() as BytesLike, subMerkleTree.getRoot() as BytesLike
            );
            await tx.wait();
            const { data, error } = await supabase.from('excluded-depositors').insert([{ depositor: depositor.toLowerCase() }]);
            if (error) {
                throw(error);
            }
            console.log('Excluded depositor:', depositor);
            console.log('Published new sub merkle root on-chain:', subMerkleTree.getRoot());
        }
        res.status(200).json({ message: 'Depositor excluded' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});