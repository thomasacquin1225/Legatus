import { ethers } from 'ethers';

export class PoseidonMerkleTree {
    tree: string[];
    values: {
        value: string;
        index: number;
    }[];
    poseidon: any;

    leftChildIndex  = (i: number) => 2 * i + 1;
    rightChildIndex = (i: number) => 2 * i + 2;

    constructor(poseidon: any) {
        this.poseidon = poseidon;
        this.tree = [];
        this.values = [];
    }

    private poseidonHash(data: any[]) {
        const posHash = this.poseidon(data);
        const hash = this.poseidon.F.toString(posHash);
        let hexString = ethers.toBigInt(hash).toString(16);
        while (hexString.length < 64) {
            hexString = '0' + hexString;
        }
        return '0x'+hexString;
    }

    buildMerkleTree(leaves: string[]) { 
        if (leaves.length === 0) {
            throw new Error('Expected non-zero number of leaves');
        }

        this.values = leaves.map((value, index) => ({ value, index }));
    
        const tree = new Array<string>(2 * leaves.length - 1);
    
        for (const [i, leaf] of leaves.entries()) {
            tree[tree.length - 1 - i] = leaf;
        }
        for (let i = tree.length - 1 - leaves.length; i >= 0; i--) {
            tree[i] = this.poseidonHash([
                tree[this.leftChildIndex(i)]!,
                tree[this.rightChildIndex(i)]!,
            ]);
        }
        this.tree = tree;
    }

    insert(value: string) {
        const values = this.values.map(({ value }) => value);
        values.push(value);
        this.values = [];
        this.buildMerkleTree(values);      
    }

    getRoot(): string | null {
        return this.tree[0]!;
    }

    getTree(): string[] {
        return this.tree;
    }

    getValues(): string[] | null {
        return this.values.map(({ value }) => value)!;
    }

    getIndex(value: string): number | null {
        const index = this.values.findIndex(({ value: v }) => v === value);
        if (index === -1) {
            throw new Error('Value not found');
        }
        return index;
    }

    getTreeIndex(value: string): number | null {
        return this.tree.length - 1 - this.getIndex(value)!;
    }

    getPath(value: string): string[] {
        try {
            const index = this.getIndex(value)!;
            if (index < 0 || index >= this.tree.length) {
                throw new Error('Index out of bounds');
            }

            const path: string[] = [];
            let i = this.tree.length - 1 - index;

            while (i > 0) {
                if (i % 2 === 0) {
                    path.push(this.tree[i - 1]!);
                    i = (i - 2) / 2;
                }
                else {
                    path.push(this.tree[i + 1]!);
                    i = (i - 1) / 2;
                }
            }

            return path;
        } catch (e) {
            return [];
        }
    }

    *entries(): Iterable<[number, string]> {
        for (const [i, { value }] of this.values.entries()) {
            yield [i, value];
        }
    }

    render(): string {
        if (this.tree.length === 0) {
            throw new Error('Expected non-zero number of nodes');
        }
    
        const stack: [number, number[]][] = [[0, []]];
        const lines: string[] = [];
    
        while (stack.length > 0) {
            const [i, path] = stack.pop()!;
        
            lines.push(
                path.slice(0, -1).map(p => ['   ', '│  '][p]).join('') +
                path.slice(-1).map(p => ['└─ ', '├─ '][p]).join('') +
                i + ') ' + this.tree[i]!
            );
        
            if (this.rightChildIndex(i) < this.tree.length) {
                stack.push([this.rightChildIndex(i), path.concat(0)]);
                stack.push([this.leftChildIndex(i), path.concat(1)]);
            }
        }
    
        return lines.join('\n');
    }
};