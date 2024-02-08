import { StandardMerkleTree,  } from "@openzeppelin/merkle-tree";
import express from 'express';
import cors from 'cors';
import fs from "fs";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});