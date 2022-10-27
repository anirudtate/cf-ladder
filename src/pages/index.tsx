import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import ThemeChange from "../utils/ThemeChange";
import { trpc } from "../utils/trpc";
import { OutProblem } from "../utils/types";

const Home: NextPage = () => {
  const probs = trpc.codeforces.getProbs.useMutation();
  const userRef = useRef<HTMLInputElement>(null);
  const expertRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

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
      <main className="container flex flex-col md:flex-row">
        <form className="flex flex-col self-center md:self-start my-5 mx-8 min-w-[60vw] md:min-w-[20vw]" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="py-2 text-primary font-bold">cf-ladder</h1>
            <ThemeChange className="py-2" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Your codeforces id</span>
            </label>
            <input ref={userRef} type="text" placeholder="eg.anirudtate" className="input input-bordered input-primary w-full" />
            <label className="label">
              <span className="label-text">Someone else&apos;s cf id</span>
            </label>
            <input ref={expertRef} type="text" placeholder="eg.tourist" className="input input-bordered input-primary w-full" />
            <div className="p-2"></div>
            <input type="submit" value="fetch" className="btn btn-primary w-full" />
          </div>
        </form>
        {(probs.data) ?
          <div className="overflow-scroll p-1 w-full max-w-screen min-w-screen md:min-w-[70vw] md:max-w-[70vw]">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th className="text-center"></th>
                  <th className="whitespace-normal">Problme name</th>
                  <th className="text-center">Rating</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Code</th>
                </tr>
              </thead>
              <tbody>
                {probs.data.map((prob: OutProblem, idx) =>
                  <tr key={idx}>
                    <th className="text-center">{idx}</th>
                    <td className="max-w-xs whitespace-normal"><a className="link link-primary" target="_blank" href={"https://codeforces.com/contest/" + prob.cid + "/problem/" + prob.letter} rel="noopener noreferrer">{prob.name}</a></td>
                    <td className="text-center">{prob.rating}</td>
                    <td className={((prob.status === "solved" ? "text-success text-center" : "text-error text-center"))}>{prob.status}</td>
                    <td className="text-center"><a className="link link-primary" target="_blank" href={"https://codeforces.com/contest/" + prob.cid + "/submission/" + prob.id} rel="noopener noreferrer">code</a></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> : <div></div>
        }
      </main>
    </>
  );
};

export default Home;
