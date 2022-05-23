import { clusterApiUrl, ConfirmedSignatureInfo, Connection, PublicKey, RpcResponseAndContext, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useEffect, useRef, useState } from 'react';
import { PhantomProvider } from '../ConnectToPhantom/ConnectToPhantom';
import History from '../History/History';
import "./TransferSol.css";

interface ITransferSolProps {
	provider: PhantomProvider;
};

const network = "devnet";


const defaultDest = "A3gWSs3vB6T1hwbEP5ENJgnydBJzH3TL1QjPWASYkDbK";



export default function TransferSol(props: any) {
	console.log(props.provider.publicKey.toString());

	const connection = useRef(new Connection(clusterApiUrl(network)));

	const [destAddr, setDestAddr] = useState(defaultDest);
	const [lamports, setLamports] = useState(10000);
	const [txid, setTxid] = useState<string | null>(null);
	const [slot, setSlot] = useState<number | null>(null);
	const [myBalance, setMyBalance] = useState(0);
	const [rxBalance, setRxBalance] = useState(0);
	const [transactionsData, setTransactionsData] = useState<[]>()
	const [showHistory, setShowHistory] = useState(false);
	const transactions: any = [];

	useEffect(() => {
		connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
	}, [props.provider.publicKey]);

	useEffect(() => {
		connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
	}, [destAddr]);

	/*const init = async () => {
		let transac = await connection.current.getConfirmedSignaturesForAddress2(
			props.provider.publicKey,
			{
				limit: 10,
			}
		);
		let info = await connection.current.getAccountInfo(props.provider.publicKey);
		//transac.map(each => transactions.push(each))
		transac.map(async each => transactions.push(await connection.current.getTransaction(each.signature.toString())));
		//transac.map(async each => console.log(await connection.current.getTransaction(each.signature.toString())));
		console.log(transactions);
		
		console.log("This is the transactionsData");
		console.log(transactions);
		setTransactionsData(transactions);
		setShowHistory(true);
		
		
		
	}*/



	const handleChangeAddr = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDestAddr(event.target.value);
	};

	const handleChangeLamp = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLamports(parseInt(event.target.value));
	};

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let transaction = new Transaction({
			feePayer: props.provider.publicKey,
			recentBlockhash: (await connection.current.getLatestBlockhash()).blockhash // getRecentBlockhash is now deprecated.
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
			console.log(`Transaction ID: ${id}`);
			setTxid(id);
			connection.current.confirmTransaction(id)
			.then((confirmation: RpcResponseAndContext<any>) => {
				setSlot(confirmation.context.slot);
				connection.current.getBalance(props.provider.publicKey).then(setMyBalance);
				connection.current.getBalance(new PublicKey(destAddr)).then(setRxBalance);
				//init();
			});

		})
		.catch(console.error);
	};



  return (
		<React.Fragment>
    <div className='transfer-sol-container'>
      <label>Destination address:</label>
			<input type="text" value={destAddr} onChange={handleChangeAddr}></input>
			<label>Lamports:</label>
			<input type="number" value={lamports} onChange={handleChangeLamp}></input>
			<button onClick={handleSubmit}>Send lamports</button>
			<hr></hr>
			<p>Balance: {myBalance}</p>
			<p>Receipt Balance: {rxBalance}</p>
			<hr></hr>
			{ txid ? <p>Transaction id: <strong>{txid}</strong></p> : null}
			{ slot ? <p>Confirmation slot: <strong>{slot}</strong></p> : "Waiting confirmation slot..."}
    </div>
		{/*<History transactions={transactionsData}/>*/}
		<History connection={connection} provider={props.provider}/>
		</React.Fragment>
  )
}
