import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ThemeChange from "../utils/ThemeChange";
import { trpc } from "../utils/trpc";
import { OutProblem } from "../utils/types";

const Home: NextPage = () => {
  let i = 0;
  const [page, setPage] = useState<number>(800);
  const probs = trpc.codeforces.getProbs.useMutation();
  const userRef = useRef<HTMLInputElement>(null);
  const expertRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  const GetPagination = () => {
    if (probs.data == "wrong" || probs.data == undefined) return <></>;
    const ratings = new Set<number>();
    probs.data.map((p) => {
      ratings.add(p.rating);
    })
    return <div className="grid grid-cols-4">
      <label className="label col-span-4">
        <span className="label-text">Rating</span>
      </label>
      {[...ratings].map((r) =>
        <div className={"btn btn-primary " + ((page == r) ? "" : "btn-outline")} key={r} onClick={() => { setPage(r) }}>{r}</div>
      )}
      <div className="p-2"></div>
    </div>
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!userRef.current || !expertRef.current) return;
    probs.mutate({ user: userRef.current.value, expert: expertRef.current.value })
  }

  return (
    <>
      <Head>
        <title>cf-ladder</title>
        <meta name="description" content="ladder to help you succeed on codeforces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* TODO : layout*/}
      <main className="container flex flex-col items-center w-full min-h-screen md:flex-row">
        <div className="flex items-center justify-center md:self-start mx-8 min-w-[60%] md:min-w-[20%]">
          <form className="flex flex-col self-center transition-transform" onSubmit={handleSubmit}>
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="py-2 text-primary font-bold">cf-ladder</h1>
              <ThemeChange className="py-2" />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Your codeforces id</span>
              </label>
              <input required ref={userRef} type="text" placeholder="eg.anirudtate" className="input input-bordered input-primary w-full" />
              <label className="label">
                <span className="label-text">Someone else&apos;s cf id</span>
              </label>
              <input required ref={expertRef} type="text" placeholder="eg.tourist" className="input input-bordered input-primary w-full" />
              <div className="p-2"></div>
              {(probs.data == "wrong") ?
                <>
                  <div className="alert alert-error">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Wrong codeforces id</span>
                    </div>
                  </div>
                  <div className="p-2"></div>
                </>
                : <div></div>}
              <input type="submit" value="fetch" className={"btn btn-primary w-full " + (probs.isLoading ? "btn-disabled" : "")} disabled={probs.isLoading} />
              <div className="p-2"></div>
              <GetPagination />
            </div>
          </form>
        </div>
        {(probs.isLoading) ?
          <div className="flex items-center justify-center p-1 w-screen md:min-w-[70vw] md:max-w-[70vw]">
            <div className="p-2"></div>
            {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* eslint-disable-next-line no-use-before-define */} {/* @ts-ignore */}
            <div className="radial-progress text-primary animate-spin" style={{ "--value": 70, "--size": "4rem", "--thickness": "5px" }}></div>
          </div>
          :
          <></>
        }
        {(probs.data != "wrong" && probs.data != undefined) ?
          <div className="p-1 w-screen md:min-w-[70vw] md:max-w-[70vw]">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th className="text-center"></th>
                  <th className="whitespace-normal">Problme name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Code</th>
                </tr>
              </thead>
              <tbody>
                {probs.data.map((prob: OutProblem) => {
                  if (prob.rating != page) return;
                  i++;
                  return <tr key={i}>
                    <th className="text-center">{i}</th>
                    <td className="max-w-xs whitespace-normal"><a className="link link-primary" target="_blank" href={"https://codeforces.com/contest/" + prob.cid + "/problem/" + prob.letter} rel="noopener noreferrer">{prob.name}</a></td>
                    <td className={((prob.status === "solved" ? "text-success text-center" : "text-error text-center"))}>{prob.status}</td>
                    <td className="text-center"><a className="link link-primary" target="_blank" href={"https://codeforces.com/contest/" + prob.cid + "/submission/" + prob.id} rel="noopener noreferrer">code</a></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div> : <div></div>
        }
      </main>
    </>
  );
};

export default Home;
