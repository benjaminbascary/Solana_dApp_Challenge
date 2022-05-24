import { clusterApiUrl, Connection, PublicKey, RpcResponseAndContext, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useEffect, useRef, useState } from 'react';
import { network, defaultDest, minimunSol, solDefaultExchange } from '../../utils/devUtils';
import "./TransferSol.css";

/*interface ITransferSolProps {
	provider: PhantomProvider;
};*/

export default function TransferSol(props: any) {

	const connection = useRef(new Connection(clusterApiUrl(network)));

	const [destAddr, setDestAddr] = useState(defaultDest);
	const [lamports, setLamports] = useState(10000);
	const [txid, setTxid] = useState<string | null>(null);
	const [slot, setSlot] = useState<number | null>(null);
	const [myBalance, setMyBalance] = useState(0);
	const [rxBalance, setRxBalance] = useState(0);
	const [sol, setSol] = useState<any>()

	useEffect(() => {
		connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
	}, [props.provider.publicKey]);

	useEffect(() => {
		connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
	}, [destAddr]);

	const handleChangeAddr = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDestAddr(event.target.value);
	};

	const handleChangeLamp = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLamports(parseInt(event.target.value));
		setSol(parseInt(event.target.value) / solDefaultExchange)
	};

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let transaction = new Transaction({
			feePayer: props.provider.publicKey,
			recentBlockhash: (await connection.current.getLatestBlockhash()).blockhash 
		});
		
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: props.provider.publicKey,
				toPubkey: new PublicKey(destAddr),
				lamports: lamports,
			})
			
		);
		
		await props.provider.signTransaction(transaction);

		connection.current.sendRawTransaction(transaction.serialize())
		.then(id => {
			setTxid(id);
			connection.current.confirmTransaction(id)
			.then((confirmation: RpcResponseAndContext<any>) => {
				setSlot(confirmation.context.slot);
				connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
				connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
			});

		})
		.catch(console.error);
	};

  return (
		
    <div className='transfer-sol-container'>
		<h1 className='transfer-title'>Transfer</h1>
		<label>Enter destination address:</label>
		<input className="transfer-address-input"type="text" value={destAddr} disabled={true} onChange={handleChangeAddr}></input>
		<label>Lamports:</label>
		<input className="transfer-address-input" type="number" value={lamports} onChange={handleChangeLamp}></input>
		{sol > minimunSol ? <p>{sol} SOL</p> : null}
		<button className="transfer-button" onClick={handleSubmit}>Send lamports</button>
		<p>Balance: {myBalance}</p>
		<p>Receipt Balance: {rxBalance}</p>
		{ txid ? <p>Transaction id: <strong>{txid}</strong></p> : null}
		{ slot ? <p>Confirmation slot: <strong>{slot}</strong></p> : "Waiting confirmation slot..."}
    </div>
  )
}
