import React from 'react';
import { Connection, PublicKey, clusterApiUrl, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
import {FC, useEffect, useRef, useState} from "react";
import "./AirDrop.css";

interface AirDropProps {
    pubkey: PublicKey
};

const network = "devnet";

export default function AirDrop({pubkey} : {pubkey: any}) {

	const connection = useRef(new Connection(clusterApiUrl(network)));

	const [publickey] = useState<string>(pubkey.toBase58())
	const [lamports, setLamports] = useState(10000);			//1 SOL = 1 lamport * 10^9
	const [txid, setTxid] = useState<string | null>(null); //transaction ID
	const [slot, setSlot] = useState<number | null>(null);
	const [balance, setBalance] = useState(0);
	const [showInfo, setShowInfo] = useState(false);





	useEffect(() => {
		connection.current.getBalance(pubkey).then(setBalance);
	}, [pubkey]);

	const handleSubmit : React.MouseEventHandler<HTMLButtonElement> = (event) => {
		setShowInfo(true);
		console.log("Requesting airdrop");
		pubkey && connection.current.requestAirdrop(pubkey, lamports)
		.then((id: string) => {
			console.log("Transaction ID: " + id);
			setTxid(id);
			connection.current.confirmTransaction(id)
			.then((confirmation : RpcResponseAndContext<SignatureResult>) => {
				console.log(`Confirmation slot: ${confirmation.context.slot}`);
				setSlot(confirmation.context.slot);
				connection.current.getBalance(pubkey).then(setBalance);
			});
		})
		.catch(console.error)
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLamports(parseInt(event.target.value));
		console.log(`Introducing: ${lamports}...`);
	};

  return (
    <div className='airdrop-container'>
        <h1>AirDrop</h1>
				<div className='airdrop-form-container'>
					<p>Remeber: this is only for test purposes. If you want to see devnet transactions:</p>
					<p>1. Open your wallet, go to Settings and change the network to "devnet" on Network Settings.</p>
					<label>Public Key where yo want your Aidrop:</label>
					<input className='public-key-input' type="text" value={pubkey} readOnly={true}></input>
					<label>Lamports to request</label>
					<input type="number" onChange={handleChange} value={lamports}></input>
					<button onClick={handleSubmit}>Request AirDrop</button>
				</div>
				<div>
					{ showInfo &&
					<div>
						{txid ? <p>Transaction: {txid}</p>: <p>Waiting for transaction id.</p>}
						{slot ? <p>Confirmation slot: {slot}</p> : <p>Waiting for slot confirmation...</p>}
					</div>
					}
				</div>
				<p>Current Balance: {balance}</p>
    </div>
  )
}
