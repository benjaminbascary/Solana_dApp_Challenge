import React, { useEffect, useState } from 'react';
import "./History.css";

export default function History(props: any) {
  
  const {connection, provider} = props;
  const [auxiliarTrans, setAuxiliarTrans] = useState<any>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  let transactions: any = [];

  useEffect(() => {
      init();
  }, []);


  const init = async () => {
    let transac = await connection.current.getConfirmedSignaturesForAddress2(
      provider.publicKey,
      {
        limit: 8,
      }
    );
    
    transac.map(async (each: { signature: { toString: () => any; }; }) => transactions.push(await connection.current.getTransaction(each.signature.toString())));
    setTransactionsData(transac)
    console.log(transactions);
  };

  return (
    <div className='history-container'>
      <div className='hisotry-table-container'>
        {
          transactions ? 
          (
            <div>
              {transactions.map((each: any) => {
                return  <div>
                          <p>{each.meta.fee}</p>
                          <p></p>
                        </div>
              })}
            </div>
          ) : (
            <h1>Looks like you dont have any history yet!</h1>
          )
        }
      </div>
    </div>
  )
}
