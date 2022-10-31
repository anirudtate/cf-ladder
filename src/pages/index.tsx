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
      <main className="max-w-4xl m-auto flex flex-col gap-2 items-center md:justify-center min-h-screen md:flex-row md:items-start">
        <form className="flex flex-col p-4 flex-shrink-0 w-80" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <h1 className="text-primary font-bold">cf-ladder</h1>
              <span className="label-text">by <a className="link link-primary link-hover" href="https://codeforces.com/profile/anirudtate" target="_blank" rel="noopener noreferrer">anirudtate</a></span>
            </div>
            <ThemeChange className="" />
          </div>
          <div className="p-2"></div>
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
        {(probs.isLoading) ?
          <div className="flex items-center justify-center w-full md:h-screen">
            <div className="p-2"></div>
            {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* eslint-disable-next-line no-use-before-define */} {/* @ts-ignore */}
            <div className="radial-progress text-primary animate-spin" style={{ "--value": 70, "--size": "3rem", "--thickness": "4px" }}></div>
          </div>
          :
          <></>
        }
        {(probs.data != "wrong" && probs.data != undefined) ?
          <table className="table table-compact table-zebra w-full">
            <thead>
              <tr>
                <th className="text-center"></th>
                <th className="whitespace-normal">Problem name</th>
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
          : <div></div>
        }
      </main>
    </>
  );
};

export default Home;
