const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const tar = require("tar");

require('dotenv').config();

const SINDRI_API_KEY = process.env.SINDRI_API_KEY || "<your-key-here>";
const CIRCUIT_ID = process.env.CIRCUIT_ID || "<your-circuit-id-here>";

axios.defaults.baseURL = "https://sindri.app/api/v1";
axios.defaults.headers.common["Authorization"] = `Bearer ${SINDRI_API_KEY}`;
axios.defaults.validateStatus = (status) => status >= 200 && status < 300;


async function createCircuit() {
    const formData = new FormData();
    formData.append(
        "files",
        tar.c({ gzip: true, sync: true }, ["circuits/"]).read(),
        {
            filename: "compress.tar.gz",
        },
    );

    const createResponse = await axios.post(
        "/circuit/create",
        formData,
    );
    const circuitId = createResponse.data.circuit_id;
    console.log("Circuit ID:", circuitId);

    let startTime = Date.now();
    let circuitDetailResponse;
    while (true) {
        circuitDetailResponse = await axios.get(`/circuit/${circuitId}/detail`, {
            params: { include_verification_key: false },
        });
        const { status } = circuitDetailResponse.data;
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
        if (status === "Ready") {
            console.log(`Polling succeeded after ${elapsedSeconds} seconds.`);
            break;
        } else if (status === "Failed") {
            throw new Error(
                `Polling failed after ${elapsedSeconds} seconds: ${circuitDetailResponse.data.error}.`,
            );
        } else if (Date.now() - startTime > 30 * 60 * 1000) {
            throw new Error("Timed out after 30 minutes.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("Circuit Detail:");
    console.log(circuitDetailResponse.data);
}
    

async function generateProof() {
    const filePath = "./circuits/Prover.toml";
    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        
        const package_name = "legatus";
        const proofInput = data;
        const circuitId = CIRCUIT_ID;
        const proveResponse = await axios.post(`/circuit/${circuitId}/prove`, {
            proof_input: proofInput,
        });
        const proofId = proveResponse.data.proof_id;
        console.log("Proof ID:", proofId);

        let startTime = Date.now();
        let proofDetailResponse;
        while (true) {
            proofDetailResponse = await axios.get(`/proof/${proofId}/detail`);
            const { status } = proofDetailResponse.data;
            const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            if (status === "Ready") {
                console.log(`Polling succeeded after ${elapsedSeconds} seconds.`);
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
        console.log("Proof Output:");
        console.log(proofDetailResponse.data.proof);
        console.log("Public Output:");
        console.log(proofDetailResponse.data.public);

        // Create circuits/proofs if it does not exist
        const proof_dir = "./circuits/proofs";
        if (!fs.existsSync(proof_dir)) {
            fs.mkdirSync(proof_dir);
        }

        fs.writeFileSync(
            "circuits/proofs/"+package_name+".proof",
            String(proofDetailResponse.data.proof["proof"]),
        );

        fs.writeFileSync(
            "circuits/Verifier.toml",
            String(proofDetailResponse.data.public["Verifier.toml"]),
        );
    });
}


// createCircuit();
generateProof();
