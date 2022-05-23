import React, { useEffect, useState } from 'react';
import "./History.css";



export default function History(props: any) {
  
  const {connection, provider} = props;
  
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const transactions: any = [];

  const init = async () => {
    let transac = await connection.current.getConfirmedSignaturesForAddress2(
      provider.publicKey,
      {
        limit: 10,
      }
    );
    transac.map(async (each: { signature: { toString: () => any; }; }) => transactions.push(await connection.current.getTransaction(each.signature.toString())));
    setTransactionsData(transactions);
  };

  useEffect(() => {
    window.process = {
      ...window.process,
    };
    init()
  }, []);

  const handleClick = () => {
    init();
    setShowHistory(preValue => {
      return !preValue
    })
  };

  return (
    <div className='history-container'>
      <button onClick={handleClick}>Show History</button>
      <div>
        {
          showHistory &&
          transactionsData.map((eachEntry: any) => {
            return <p>{eachEntry.meta.postBalances[0]}</p>
          })
        }
      </div>
    </div>
  )
}
