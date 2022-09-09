import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import Link from '../src/Link';
import { useState } from 'react';
import { lightGreen, red } from '@mui/material/colors';

const Home: NextPage = () => {
  const [user, setUser] = useState("");
  const [expert, setExpert] = useState("");
  const [probs, setProbs]: any = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          m: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}
      >
        <Typography variant='h3'>
          Road To LGM
        </Typography>
        <Typography variant='subtitle1'>
          Created by <Link href="https://codeforces.com/profile/anirudtate" underline='hover'>anirudtate</Link>
        </Typography>
        <TextField label="your codeforces id" placeholder='eg. anirudtate' value={user} onChange={(e) => { setUser(e.target.value) }}></TextField>
        <TextField label="LGM's codeforces id" placeholder='eg. tourist' value={expert} onChange={(e) => { setExpert(e.target.value) }}></TextField>
        <Button disabled={loading} variant="outlined" size="large" onClick={async () => {
          setLoading(true); 
          const userRes = await fetch("https://codeforces.com/api/user.status?handle=" + user);
          const expertRes = await fetch("https://codeforces.com/api/user.status?handle=" + expert);
          let userProbs = await userRes.json();
          userProbs = userProbs.result;

          let userSolved: any = {};
          userProbs.forEach((userprob: any) => {
            if(userprob.verdict !== "OK") return;
            userSolved[userprob.problem.name] = 1;
          })

          let expertProbs = await expertRes.json();
          expertProbs = expertProbs.result;

          let probNames: Set<string> = new Set();
          let probsInfo: Array<any> = [];
          expertProbs.forEach((expertprob: any) => {
            if (expertprob.verdict !== "OK") return;
            if (expertprob.problem.rating == undefined) return;
            const name: string = expertprob.problem.name;
            if (probNames.has(name)) return;
            probNames.add(name);
            let obj: any = {};
            obj.id = expertprob.id;
            obj.cid = expertprob.problem.contestId;
            obj.status = (userSolved[name] === 1)?"solved":"unsolved";
            obj.rating = expertprob.problem.rating;
            obj.name = name;
            obj.letter = expertprob.problem.index;
            probsInfo.push(obj);
          })
          probsInfo.sort((a,b) => a.rating - b.rating);
          setProbs(probsInfo);
          setLoading(false); 
        }}>FETCH</Button>
        {(loading)?
        <CircularProgress sx={{my: 5}}/>
        :
        <Table sx={{mx: 4}}>
          <TableBody>
            {probs.map((p : any) =>
              <TableRow key={p.id}>
                <TableCell align='left'><Link underline='hover' target="_blank" href={"https://codeforces.com/contest/"+p.cid+"/problem/"+p.letter}>{p.name}</Link></TableCell>
                <TableCell align='center'>{p.rating}</TableCell>
                <TableCell align='center' sx={{color:((p.status === "unsolved")?red[500]:lightGreen[500]),fontWeight:"bold"}}>{p.status}</TableCell>
                <TableCell align='center'><Link underline='none' target="_blank" href={"https://codeforces.com/contest/"+p.cid+"/submission/"+p.id}>code</Link></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        }
      </Box>
    </Container>
  );
};

export default Home;
