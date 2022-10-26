export interface OutProblem {
  id: number;
  cid: number;
  status: string;
  rating: number;
  name: string;
  letter: string;
}


export interface Root {
  status: string
  result: Result[]
}

export interface Result {
  id: number
  contestId: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: Problem
  author: Author
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

export interface Problem {
  contestId: number
  index: string
  name: string
  type: string
  points: number
  rating: number
  tags: string[]
}

export interface Author {
  contestId: number
  members: Member[]
  participantType: string
  ghost: boolean
  startTimeSeconds: number
}

export interface Member {
  handle: string
}
