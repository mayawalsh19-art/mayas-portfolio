export const PLAYER_AVATARS = ['😊','😎','🌸','🦋','🌻','💫','🦊','🐱','🌈','⚡','🍀','🎭']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Large trait pool — all real dating behaviors ─────────────────────────────
export const TRAIT_POOL = [
  // Green flags
  { text: 'Actually listens without waiting for their turn to talk',         value:  3 },
  { text: 'Texts back within a reasonable amount of time',                   value:  1 },
  { text: 'Has their own thing going on and loves that you do too',          value:  2 },
  { text: 'Splits the bill without making it a whole thing',                 value:  1 },
  { text: 'Apologizes when they are wrong, and actually means it',           value:  3 },
  { text: 'Makes plans and follows through on them every time',              value:  2 },
  { text: 'Will drop everything and come through if you really need them',   value:  3 },
  { text: 'Gives compliments without an agenda behind them',                 value:  2 },
  { text: 'Has a therapist and actually shows up to the appointments',       value:  3 },
  { text: 'Celebrates your wins like they are their own',                    value:  3 },
  { text: 'Picks up on your mood without you having to say anything',        value:  2 },
  { text: 'Keeps the same energy in public as they do in private',           value:  3 },
  { text: 'Has close friends from every chapter of their life',              value:  2 },
  { text: 'Knows when to give you space without being asked',                value:  2 },
  { text: 'Sends a thinking of you text for absolutely no reason',           value:  2 },
  { text: 'Takes accountability without making it about themselves',         value:  3 },
  { text: 'Remembers small things you mentioned weeks ago',                  value:  2 },
  { text: 'Always on time or texts ahead when they cannot be',               value:  1 },
  { text: 'Genuinely curious about what you think and feel',                 value:  2 },
  { text: 'Can sit in comfortable silence without making it weird',          value:  2 },
  { text: 'Introduced you to their friends within the first month',          value:  2 },
  { text: 'Brings things up calmly instead of letting resentment build',     value:  3 },
  { text: 'Will ugly laugh with you and not care how they look',             value:  2 },
  { text: 'Checks in after you mentioned something stressful',               value:  2 },
  { text: 'Asks before giving advice instead of just launching into it',     value:  2 },
  { text: 'Never makes you feel dumb for asking a question',                 value:  2 },
  { text: 'Has hobbies they are genuinely passionate about',                 value:  1 },
  { text: 'Shows up to things that matter to you even if they are not their thing', value: 3 },
  { text: 'Always introduces you when running into people they know',        value:  2 },
  { text: 'Gives you a real answer when you ask how they are doing',         value:  2 },

  // Yellow flags
  { text: 'Still really close with their mom — almost too close',            value:  0 },
  { text: 'Has very strong opinions about things that do not matter',        value: -1 },
  { text: 'Posts everything on their story the moment it happens',           value: -1 },
  { text: 'Gets a little too intense about their interests',                 value: -1 },
  { text: 'Their friend group has a lot of ongoing drama in it',             value: -1 },
  { text: 'Very particular about how certain things need to be done',        value: -1 },
  { text: 'Still brings up the one time you did something small and wrong',  value: -1 },
  { text: 'Never initiates — always waiting for you to reach out first',     value: -1 },
  { text: 'Tells you they are fine when they are clearly not fine',          value: -1 },
  { text: 'Gets a little weird about who likes your posts',                  value: -1 },

  // Red flags
  { text: 'Cancels plans more than they keep them',                          value: -2 },
  { text: 'Has a different version of every story depending on who is asking', value: -2 },
  { text: 'Goes cold without explanation and calls it needing space',        value: -2 },
  { text: 'Brings up old arguments whenever they are losing the current one', value: -2 },
  { text: 'Talks about their ex way more than feels casual',                 value: -2 },
  { text: 'Gets weird about you spending time with your own friends',        value: -3 },
  { text: 'Needs to win every single disagreement',                          value: -2 },
  { text: 'Love bombs hard then slowly disappears',                          value: -3 },
  { text: 'Their phone is always face-down when you are around',             value: -2 },
  { text: 'Has been almost ready to commit for about three years now',       value: -2 },
  { text: 'Makes you feel guilty for having a life outside of them',         value: -3 },
  { text: 'Can dish it but absolutely cannot take it',                       value: -2 },
  { text: 'Keeps score of everything even when they say they do not',        value: -2 },
  { text: 'Their situationship with their ex is quote just complicated',     value: -2 },
  { text: 'Says one thing and consistently does another',                    value: -3 },
  { text: 'Gets defensive the moment any concern is raised',                 value: -2 },
  { text: 'Still follows every single ex on every platform',                 value: -1 },
  { text: 'Flakes and then acts like nothing happened',                      value: -2 },
  { text: "Their whole thing is 'I don't really do labels'",                value: -2 },
  { text: 'Takes two or three days to respond, no explanation',              value: -2 },
  { text: 'Uses your vulnerability as material for their own growth',        value: -3 },
  { text: 'Never asks how you are doing — only talks about themselves',      value: -2 },
  { text: 'Gets jealous but calls it caring',                                value: -2 },
  { text: 'Knows exactly what to say and rarely means any of it',            value: -3 },
]

// ─── Archetype pool — randomized each game ────────────────────────────────────
const ARCHETYPE_POOL = [
  { archetype: 'THE OVERTHINKER',     tags: ['SPIRALING', 'TRIPLE TEXTED', 'DRAFTED 11 VERSIONS'],  bio: 'Has typed and deleted this message eleven times.' },
  { archetype: 'THE SITUATIONSHIP',   tags: ['UNDEFINED', 'NO LABELS', 'IT IS COMPLICATED'],       bio: 'Not your person. Not not your person.' },
  { archetype: 'THE LOVE BOMBER',     tags: ['INTENSE', 'TOO FAST', 'TOO MUCH'],                   bio: 'Makes you feel like the main character. For about two weeks.' },
  { archetype: 'THE GYM PERSON',      tags: ['5AM WAKEUP', 'PROTEIN FIRST', 'NO REST DAYS'],       bio: 'The body is a temple. Your feelings are a side quest.' },
  { archetype: 'THE SOFT LAUNCH',     tags: ['BACK OF PHOTO', 'NO CAPTIONS', 'ALMOST OFFICIAL'],   bio: 'You have been in six posts. None of them show your face.' },
  { archetype: 'THE THERAPY SPEAK',   tags: ['BOUNDARIES', 'TRIGGERED', 'DOING THE WORK'],         bio: 'Has the vocabulary. Working on the follow-through.' },
  { archetype: 'THE TRAVELER',        tags: ['JUST LANDED', 'ALWAYS LEAVING', 'CHECK MY STORIES'], bio: 'Amazing in photos. Never in the same city for two weeks.' },
  { archetype: 'THE HOMEBODY',        tags: ['COUCH FIRST', 'STAY IN', 'MOVIE NIGHT'],             bio: 'Warm, comfortable, has not left the apartment since Thursday.' },
  { archetype: 'THE PARTY HOST',      tags: ['COME THROUGH', 'BRING PEOPLE', 'STILL GOING'],       bio: 'Knows everyone. Close with almost nobody.' },
  { archetype: 'THE FLAKE',           tags: ['MAYBE', 'LET ME CHECK', 'SOMETHING CAME UP'],        bio: 'Fully committed to attending. Right up until they are not.' },
  { archetype: 'THE ROMANTIC',        tags: ['HOPEFUL', 'SOFT HEART', 'ALL IN'],                   bio: 'Has been waiting their whole life to meet someone like you.' },
  { archetype: 'THE COMMITMENT-PHOBE',tags: ['JUST HAVING FUN', 'NOT LOOKING FOR ANYTHING', 'OPEN'], bio: 'Great one-on-one. Horrified by the word exclusive.' },
  { archetype: 'THE PEOPLE PLEASER',  tags: ['NO IS HARD', 'WHATEVER YOU WANT', 'TOTALLY FINE'],   bio: 'Will agree with everything and slowly resent you for it.' },
  { archetype: 'THE SOCIAL MEDIA ONE',tags: ['CONTENT FIRST', 'GOOD LIGHTING', 'THAT IS CUTE'],   bio: 'If it is not posted it did not happen. Including you.' },
  { archetype: 'THE LATE BLOOMER',    tags: ['STILL FIGURING IT OUT', 'GREW UP RECENTLY', 'TRYING'], bio: 'Just started doing the work. Give them a minute.' },
  { archetype: 'THE MAIN CHARACTER',  tags: ['STORYLINE', 'ERA', 'UNBOTHERED'],                    bio: 'Every moment is their moment. Including yours.' },
]

// ─── Player types — each changes how trait values score for that player ────────
export const PLAYER_TYPES = [
  {
    id: 'romantic',
    label: 'THE ROMANTIC',
    emoji: '💘',
    desc: 'You fall fast. Green flags hit different.',
    adjust: v => v > 0 ? v + 1 : v,
  },
  {
    id: 'selective',
    label: 'THE SELECTIVE',
    emoji: '🎯',
    desc: 'High standards. Red flags cost double.',
    adjust: v => v < 0 ? v - 1 : v,
  },
  {
    id: 'chaotic',
    label: 'THE CHAOTIC ONE',
    emoji: '🔥',
    desc: 'Red flags? Spicy. Boring is the dealbreaker.',
    adjust: v => v < 0 ? Math.min(v + 2, 0) : v,
  },
  {
    id: 'overthinker',
    label: 'THE OVERTHINKER',
    emoji: '🌀',
    desc: 'Yellow flags are red flags. Patterns everywhere.',
    adjust: v => v === -1 ? -3 : v === 0 ? -1 : v,
  },
  {
    id: 'avoidant',
    label: 'THE AVOIDANT',
    emoji: '🚪',
    desc: 'Too much too soon. Space is your love language.',
    adjust: v => v >= 3 ? v - 1 : v <= -2 ? v - 1 : v,
  },
  {
    id: 'gold_digger',
    label: 'THE GOLD DIGGER',
    emoji: '💰',
    desc: 'Stability and potential. The math maths.',
    adjust: v => v < -1 ? v - 1 : v >= 2 ? v + 1 : v,
  },
]

// ─── Name pool ────────────────────────────────────────────────────────────────
const NAME_POOL = [
  'Kai', 'Nova', 'Rex', 'Sam', 'Ash', 'Echo', 'Max', 'Blair', 'Ollie', 'Zoe',
  'Finn', 'Ren', 'Jordan', 'Riley', 'Drew', 'Morgan', 'Casey', 'Sage', 'Avery',
  'Blake', 'River', 'Skylar', 'Remi', 'Logan', 'Emery', 'Rowan', 'Marlowe',
  'Lennox', 'Quinn', 'Sloane', 'Wren', 'Indigo', 'Jules', 'Noel', 'Darcy',
]

const EMOJIS  = ['💫','⚡','🌙','🔥','💀','🌊','🎯','🦋','🌻','🃏','🎭','🌟','🍂','🖤','🌹']
const DOLLS   = ['rell', 'bibi', 'ada', 'dax', 'kip', 'suki']
const AGES    = [22, 23, 24, 25, 26, 27, 28, 29, 30]

// ─── Profile generator — called fresh every game ──────────────────────────────
export function generateProfiles(count = 7, customTraits = []) {
  const names      = shuffle([...NAME_POOL])
  const archetypes = shuffle([...ARCHETYPE_POOL])
  const fullPool   = shuffle([
    ...TRAIT_POOL,
    ...customTraits.map(ct => ({ text: ct.text, value: ct.value })),
  ])

  const profiles = []
  let traitCursor = 0

  for (let i = 0; i < count; i++) {
    // Pick 6 unique traits from the pool, cycling if needed
    const picked = []
    while (picked.length < 6) {
      if (traitCursor >= fullPool.length) {
        traitCursor = 0
        // reshuffle so repeats feel less obvious
        fullPool.splice(0, fullPool.length, ...shuffle([...fullPool]))
      }
      picked.push(fullPool[traitCursor++])
    }

    // Make 2 visible (the less extreme ones) and 4 hidden
    const sorted = [...picked].sort((a, b) => Math.abs(a.value) - Math.abs(b.value))
    const traits = sorted.map((t, idx) => ({ ...t, startVisible: idx < 2 }))

    profiles.push({
      id:        `gen_${i}`,
      name:      names[i % names.length],
      age:       AGES[Math.floor(Math.random() * AGES.length)],
      emoji:     EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      doll:      DOLLS[Math.floor(Math.random() * DOLLS.length)],
      archetype: archetypes[i % archetypes.length].archetype,
      tags:      archetypes[i % archetypes.length].tags,
      bio:       archetypes[i % archetypes.length].bio,
      traits,
    })
  }

  return profiles
}

export const THE_ONE_PROFILE = {
  id: 'the_one', name: 'Quinn', age: 27, emoji: '💘', doll: 'rell',
  archetype: 'THE LEGENDARY DROP',
  tags: ['LEGENDARY TIER', '1% DROP RATE', 'FINAL AREA'],
  bio: "1% chance. Your whole game comes down to this moment.",
  traits: [
    { text: 'Has never left something important unfinished',       value:  2, startVisible: true  },
    { text: 'Carrying something heavy from before you met',        value:  0, startVisible: false },
    { text: 'Asks the kind of questions no one else thinks to ask', value: 2, startVisible: false },
    { text: 'Still figuring some things out — but who is not',     value: -1, startVisible: false },
    { text: 'Once you are in their life, you are in it for good',  value:  5, startVisible: false },
  ],
}

export function profileScore(profile) {
  return profile.traits.reduce((s, t) => s + t.value, 0)
}

export function getPersonality(player) {
  if (player.foundTheOne)        return { title: 'THE CATCH',         desc: 'You found The One and played a perfect game.' }
  if (player.loveScore >= 18)    return { title: 'THE ROMANTIC',      desc: 'Your heart led the way — and it paid off.' }
  if (player.ghostsUsed === 3)   return { title: 'THE GHOST',         desc: 'You mastered the exit. No mess, no drama.' }
  if (player.ghostsUsed >= 2)    return { title: 'THE FUN GHOSTER',   desc: 'Strategic. Selective. Suspiciously unbothered.' }
  if (player.redFlagsCount >= 2) return { title: 'THE RISK TAKER',    desc: 'You dated every red flag and survived.' }
  if (player.heartbreakMode)     return { title: 'THE RISK TAKER',    desc: 'You went for it every time. No regrets.' }
  if (player.ghostsUsed >= 1)    return { title: 'THE SELECTIVE ONE', desc: 'Careful. Discerning. Knew when to walk away.' }
  return { title: 'THE SELECTIVE ONE', desc: 'You played it smart from the very beginning.' }
}
