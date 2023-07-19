import Head from "next/head";
import { useState } from "react";
import { http, createWalletClient } from 'viem'
import { mainnet } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'
import { type TBAccountParams } from "@tokenbound/sdk/dist/src/TokenboundClient";

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(),
})
const tokenboundClient = new TokenboundClient({ walletClient, chainId: 5 })

const DEFAULT_ACCOUNT: TBAccountParams = {
  tokenContract: "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb",
  tokenId: "9"
}

export default function Home() {
  const [retrievedAccount, setRetrievedAccount] = useState<string>("");
  const [TBAccount, setTBAccount] = useState<TBAccountParams>(DEFAULT_ACCOUNT)
  const [error, setError] = useState<{
    isError: boolean,
    reason: string
  }>({
    isError: false,
    reason: ""
  });

  const getAccount = () => {
    if (!TBAccount.tokenId) {
      return setError({
        isError: true,
        reason: "tokenId undefined"
      })
    }
    try {
      const account = tokenboundClient.getAccount(TBAccount)
      setRetrievedAccount(account);
      setError({isError: false, reason: ""});
    } catch(err) {
      console.error(err);
      setRetrievedAccount("");
      setError({
        isError: true,
        reason: JSON.stringify(err)
      });
    }
  }

  const resetAccount = () => {
    setRetrievedAccount("");
    setTBAccount(DEFAULT_ACCOUNT);
    setError({isError: false, reason: ""});
  }

  return (
    <>
      <Head>
        <title>Tokenbound Demo 1</title>
        <meta name="description" content="fp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#76004f] to-[#15162c]">
        <div className="container flex flex-col gap-12 px-4 py-16 ">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Check <span className="text-[hsl(187,100%,68%)]">tokenbound account</span> for any NFT
          </h1>
          <div className="p-4 border-2 border-white rounded-xl text-white">
            Use the <a href="https://tokenbound.org" target="_blank" className="underline">tokenbound explorer ↗️</a> to explore NFTs and their wallets.
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 text-white">
            <form onSubmit={(e) => {
              e.preventDefault();
              getAccount();
            }} className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <label htmlFor="nftContract">
                NFT Contract
              </label>
              <input type="text" className="h-fit p-2 rounded-lg bg-slate-300 text-black" id="nftContract" onChange={(event) => setTBAccount({...TBAccount, tokenContract: event.target.value as TBAccountParams["tokenContract"]})} value={TBAccount.tokenContract} />
              <label htmlFor="nftTokenId">
                Token ID
              </label>
              <input type="text" className="h-fit p-2 rounded-lg bg-slate-300 text-black" id="nftTokenId" onChange={(event) => setTBAccount({...TBAccount, tokenId: event.target.value})} value={TBAccount.tokenId}/>
              <button type="submit" className="h-fit p-2 bg-slate-100 rounded-lg col-span-2 text-black self-end">Check</button>
            </form>
            <div className="text-white font-mono grid grid-cols-1 gap-4">
              <pre className="w-full overflow-x-auto">
                {JSON.stringify({...TBAccount, retrievedAccount, error}, null, 2)}
              </pre>
              <button type="button" className="p-2 bg-slate-100 rounded-lg text-black" onClick={resetAccount}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
