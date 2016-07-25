// utility functions

export function getTwoRandomIndices(len) {
  const def = [0, 1];
  if (typeof len !== 'number') {
    return def
  }
  if (len <= 1) {
    return def;
  }
  let rand1, rand2;
  rand1 = Math.floor(Math.random() * len);
  rand2 = Math.floor(Math.random() * len);

  while (rand2 === rand1) {
    rand2 = Math.floor(Math.random() * len);
  }
  return [rand1, rand2]
}

/**
 *
 * when building a finalized matchup, use 'a' for winner and 'b' for loser.
 *
 * can also be used before matchup is finalized, to see the potential change in ELO score
 *
 * return {"a":{"win":1080.6183244216031,"lose":1048.6183244216031},"b":{"win":1112.6437215974636,"lose":1080.6437215974636}}
 * @param a WINNER score
 * @param b LOSER score
 * @returns {{a: {win: *, lose: *}, b: {win: *, lose: *}}}
 */
export function getEloRating(a, b) {
  const K = 32;

  // adjusted rating
  const r1 = Math.pow(10, (a / 400));
  const r2 = Math.pow(10, (b / 400));

  // expected score
  const e1 = r1 / (r1 + r2);
  const e2 = r2 / (r1 + r2);

  // new score if 'a' wins
  const r1NewA = a + K * (1 - e1); // winner, a
  const r2NewA = b + K * (0 - e2); // loser, b

  // new score if 'b' wins
  const r2NewB = b + K * (1 - e2); // winner, b
  const r1NewB = a + K * (0 - e1); // loser, a

  return {
    a: {
      win: r1NewA,
      lose: r1NewB,
    },
    b: {
      win: r2NewB,
      lose: r2NewA
    }
  }
}
