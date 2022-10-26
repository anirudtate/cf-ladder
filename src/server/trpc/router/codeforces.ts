import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";
import { OutProblem, Result, Root } from "../../../utils/types";

export const codeforcesRouter = router({
  getProbs: publicProcedure
    .input(z.object({ user: z.string(), expert: z.string() }))
    .mutation(async ({ input }) => {
      const user = input.user.trim();
      const expert = input.expert.trim();
      if (user == "") return undefined;
      if (expert == "") return undefined;
      try {
        const userRes = await axios.get("https://codeforces.com/api/user.status?handle=" + user)
        const expertRes = await axios.get("https://codeforces.com/api/user.status?handle=" + expert)
        const userJson: Root = await userRes.data;
        const userProbs: Result[] = userJson.result;

        const userSolved = new Map<string, boolean>();
        if (userProbs == undefined) return undefined;
        userProbs.forEach((userprob: Result) => {
          if (userprob.verdict !== "OK") return;
          userSolved.set(userprob.problem.name, true);
        });

        const expertJson: Root = await expertRes.data;
        const expertProbs: Result[] = expertJson.result;

        const probNames: Set<string> = new Set();
        const probsInfo: Array<OutProblem> = [];

        if (expertProbs == undefined) return undefined;
        expertProbs.forEach((expertprob: Result) => {
          if (expertprob.verdict !== "OK") return;
          if (expertprob.problem.rating == undefined) return;
          const name: string = expertprob.problem.name;
          if (probNames.has(name)) return;
          probNames.add(name);
          const obj: OutProblem = {
            id: expertprob.id,
            cid: expertprob.problem.contestId,
            status: userSolved.get(name) === true ? "solved" : "unsolved",
            rating: expertprob.problem.rating,
            name: name,
            letter: expertprob.problem.index,
          };
          probsInfo.push(obj);
        });
        probsInfo.sort((a, b) => a.rating - b.rating);
        return probsInfo;
      }
      catch {
        return undefined;
      }
    }),
});
