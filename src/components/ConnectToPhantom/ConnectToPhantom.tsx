import React from 'react'
import { useState, useEffect} from "react";
import { PublicKey } from "@solana/web3.js";
import AirDrop from '../AirDrop/AirDrop';
import TransferSol from '../TransferSol/TransferSol';
import "./ConnectToPhantom.css";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
};

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey}>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=> void) => void;
    isPhantom: boolean;
};

type WindowWithSolana = Window & {
    solana?: PhantomProvider;
};

export default function ConnectToPhantom() {

	const [ walletAvail, setWalletAvail ] = useState(false);
	const [ provider, setProvider ] = useState<PhantomProvider | null >(null);
	const [ connected, setConnected ] = useState(false); //return value to false after putting the component on place with CSS.
	const [ pubKey, setPubKey ] = useState<PublicKey | null>(null);

	useEffect( () => {
		if ("solana" in window) {
			const solWindow = window as WindowWithSolana;
			if (solWindow?.solana?.isPhantom) {
				setProvider(solWindow.solana);
				setWalletAvail(true);
				solWindow.solana.connect({onlyIfTrusted: true});
			}
		}
	}, []);

	useEffect( () => {
		provider?.on("connect", (publickKey: PublicKey) => {
			setConnected(true)
			setPubKey(publickKey)
		});
		provider?.on("disconnect", () => {
			setConnected(false);
			setPubKey(null);
		});

	}, [provider]);

	const connectHandler : React.MouseEventHandler<HTMLButtonElement> = (event) => {
		provider?.connect()
		.catch((err) => {console.error("Connect Error" + err);     });
	};

	const disconnectHandler : React.MouseEventHandler<HTMLButtonElement> = (event) => {
		provider?.disconnect()
		.catch((err) => {console.error("disconnect error" + err); });
	};

  return (
		<React.Fragment>
    <div className='connection-container'>
		<div className='welcome-container'>
			<h1 className='welcome-title'>Welcome</h1>
		</div>
			{	
				walletAvail ?
				(
				<div className='connect-disconnect-buttons-container'>
					<button disabled={connected} onClick={connectHandler}>Connect to Phantom</button>
					<button disabled={!connected} onClick={disconnectHandler}>Disconnect from Phantom</button>
					
				</div>
  				) : (
				<div className='phantom-notinstalled-container'>
					<p>Oops! Looks like Phantom is not avaiable on your browser. You can go get it in the link below</p>
					<p>After you install the Phantom Wallet come back to sign-in into your account.</p>
					<a href='https://phantom.app/'>Get Phantom Wallet Extension</a>
				</div>
				)
			}
			{ connected ? <p className='connection-pubkey-container'>Your public key: {pubKey?.toBase58()}</p> : null}	
		</div>
		<div>
			{
				connected && 
					<React.Fragment>
						<AirDrop pubkey={pubKey} />
						<TransferSol provider={provider} />						
					</React.Fragment>
			}
		</div>
		</React.Fragment>
  )
}
