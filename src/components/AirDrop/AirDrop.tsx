import React from 'react';
import { useEffect, useRef, useState} from "react";
import { Connection, clusterApiUrl, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
import { network } from "../../utils/devUtils.js";
import "./AirDrop.css";

export default function AirDrop({pubkey} : {pubkey: any}) {

	const connection = useRef(new Connection(clusterApiUrl(network)));

	const [lamports, setLamports] = useState(10000);
	const [txid, setTxid] = useState<string | null>(null);
	const [slot, setSlot] = useState<number | null>(null);
	const [balance, setBalance] = useState(0);
	const [showInfo, setShowInfo] = useState(false);

	useEffect(() => {
		connection.current.getBalance(pubkey).then(setBalance);
	}, [pubkey]);

	const handleSubmit : React.MouseEventHandler<HTMLButtonElement> = (event) => {
		setShowInfo(true);
		pubkey && connection.current.requestAirdrop(pubkey, lamports)
		.then((id: string) => {
			setTxid(id);
			connection.current.confirmTransaction(id)
			.then((confirmation : RpcResponseAndContext<SignatureResult>) => {
				setSlot(confirmation.context.slot);
				connection.current.getBalance(pubkey).then(setBalance);
			});
		})
		.catch(console.error)
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLamports(parseInt(event.target.value));
	};

  	return (
    <div className='airdrop-container'>
        <h1 className='airdrop-title'>AirDrop</h1>
			<div className='airdrop-form-container'>
				<div className='airdrop-alert-container'>
					<p><strong>Remeber: this is only for test purposes. If you want to see devnet transactions:</strong></p>
					<p>1. Open your wallet, go to Settings and change the network to "devnet" on Network Settings.</p>
				</div>
				<label><strong>Public Key where yo want your lamports:</strong></label>
				<input className='public-key-input' type="text" value={pubkey} readOnly={true}></input>
				<label><strong>Lamports to request:</strong></label>
				<input className='airdrop-lamports-input' type="number" onChange={handleChange} value={lamports}></input>
				<button className='request-airdrop-button' onClick={handleSubmit}>Request AirDrop</button>
			</div>
			<div>
				{ 
				showInfo &&
					<div className='airdrop-transaction-container'>
						{txid ? <p><strong>Transaction:</strong> {txid}</p>: <p>Waiting for transaction id.</p>}
						{slot ? <p><strong>Confirmation slot:</strong> {slot}</p> : <p>Waiting for slot confirmation...</p>}
					</div>
				}
			</div>
			<p><strong>Current Balance: {balance}</strong></p>
    </div>
  )
}
