// Random event definitions for EVENT and ALLY nodes

const EVENTS = [
  {
    id: 'flame_war',
    title: '🔥 The Flame War',
    art: '💬',
    description: 'Your teammates are going at it in all-chat. A full-blown flame war over who lost last round. Do you engage?',
    choices: [
      {
        label: '💢 Engage',
        desc: 'Join in. At least you\'ll have fun.',
        effect: (gs) => { changeTilt(15); gs.gold += 50; return '+50g but +15 Tilt. Worth it?'; }
      },
      {
        label: '🙄 Ignore',
        desc: 'Not your circus, not your monkeys.',
        effect: (gs) => {
          changeTilt(5);
          const pool = REWARD_POOL[R.COMMON];
          const id = pool[Math.floor(Math.random() * pool.length)];
          gs.deck.push({ id, upgraded: false });
          return `+5 Tilt but gained a card: ${CARDS[id].name}`;
        }
      },
      {
        label: '🔇 Mute All',
        desc: 'Block everyone and enjoy the silence.',
        effect: (gs) => { changeTilt(-5); gs.gold = Math.max(0, gs.gold - 25); return '-5 Tilt. Cost 25g for the mute button.'; }
      }
    ]
  },

  {
    id: 'coach_offer',
    title: '🎓 Coach Offer',
    art: '📚',
    description: 'A random guy in your DMs says he\'ll coach you for free. Claims to be Diamond. His profile pic is a raccoon.',
    choices: [
      {
        label: '✅ Accept (Free)',
        desc: 'Sure, what\'s the worst that can happen?',
        effect: (gs) => {
          if (gs.deck.length > 0) {
            const idx = Math.floor(Math.random() * gs.deck.length);
            gs.deck[idx].upgraded = true;
            return `Upgraded: ${CARDS[gs.deck[idx].id].name}`;
          }
          return 'Nothing to upgrade!';
        }
      },
      {
        label: '❌ Decline',
        desc: 'You\'ll figure it out yourself.',
        effect: (gs) => { return 'Wise choice. Probably.'; }
      },
      {
        label: '💰 Pay (50g)',
        desc: 'Invest in your growth. Upgrade 2 random cards.',
        effect: (gs) => {
          if (gs.gold < 50) return 'Not enough gold!';
          gs.gold -= 50;
          let upgraded = [];
          for (let i = 0; i < 2 && gs.deck.length > 0; i++) {
            const idx = Math.floor(Math.random() * gs.deck.length);
            if (!gs.deck[idx].upgraded) { gs.deck[idx].upgraded = true; upgraded.push(CARDS[gs.deck[idx].id].name); }
          }
          return upgraded.length ? `Upgraded: ${upgraded.join(', ')}` : 'All cards already upgraded!';
        }
      }
    ]
  },

  {
    id: 'rage_quit_witness',
    title: '😤 Rage Quit Witness',
    art: '🖥️',
    description: 'You watch as a teammate types "ez" then immediately disconnects. The mood is contagious.',
    choices: [
      {
        label: '😂 Laugh',
        desc: 'It\'s funny until it happens to you.',
        effect: (gs) => {
          changeTilt(10);
          const pool = REWARD_POOL[R.COMMON];
          const id = pool[Math.floor(Math.random() * pool.length)];
          gs.deck.push({ id, upgraded: false });
          return `+10 Tilt. Got a card: ${CARDS[id].name}`;
        }
      },
      {
        label: '😔 Empathize',
        desc: 'We\'ve all been there, buddy.',
        effect: (gs) => { changeTilt(-8); return '-8 Tilt. Solidarity.'; }
      },
      {
        label: '🚩 Report',
        desc: 'At least get something out of this.',
        effect: (gs) => { gs.gold += 30; return '+30g from the report reward.'; }
      }
    ]
  },

  {
    id: 'alt_account',
    title: '🔄 Alt Account',
    art: '👤',
    description: 'You find an old smurf account. A fresh start. Clean slate. No rank anxiety.',
    choices: [
      {
        label: '🆕 Switch Accounts',
        desc: 'Remove 2 random cards from your deck. Tilt set to 10.',
        effect: (gs) => {
          for (let i = 0; i < 2 && gs.deck.length > 0; i++) {
            const idx = Math.floor(Math.random() * gs.deck.length);
            gs.deck.splice(idx, 1);
          }
          gs.tilt = 10;
          return 'Fresh start! Removed 2 cards, Tilt set to 10.';
        }
      },
      {
        label: '🚫 Ignore',
        desc: 'Face your problems like a gamer.',
        effect: (gs) => { return 'Nothing changed. Respect.'; }
      }
    ]
  },

  {
    id: 'energy_drink',
    title: '⚡ Energy Drink Sponsorship',
    art: '🥤',
    description: 'A sketchy energy drink brand slides into your DMs. "Wanna be a brand ambassador?"',
    choices: [
      {
        label: '✅ Accept Deal',
        desc: 'Gain the 6-Hour Energy relic. If you have it, gain 75g instead.',
        effect: (gs) => {
          if (!gs.relics.find(r => r.id === 'six_hour_energy')) {
            gs.relics.push(RELICS.six_hour_energy);
            return 'Gained relic: 6-Hour Energy!';
          }
          gs.gold += 75;
          return '+75g (already have the relic).';
        }
      },
      {
        label: '❌ Decline',
        desc: 'Your dignity is worth more.',
        effect: (gs) => { changeTilt(-5); return '-5 Tilt. Peace of mind.'; }
      }
    ]
  },

  {
    id: 'the_montage',
    title: '🎬 The Montage',
    art: '📹',
    description: 'Your friend made a highlight reel of your worst gaming moments. It\'s getting views.',
    choices: [
      {
        label: '▶️ Watch It',
        desc: 'Pain. But also, free card.',
        effect: (gs) => {
          changeTilt(20);
          const pool = REWARD_POOL[R.RARE];
          const id = pool[Math.floor(Math.random() * pool.length)];
          gs.deck.push({ id, upgraded: false });
          return `+20 Tilt. Gained rare card: ${CARDS[id].name}`;
        }
      },
      {
        label: '🙈 Don\'t Watch',
        desc: 'What you don\'t know can\'t hurt you.',
        effect: (gs) => { changeTilt(5); return '+5 Tilt from the anxiety of not watching.'; }
      },
      {
        label: '🗑️ Ask to Delete (60g)',
        desc: 'Pay to erase your shame.',
        effect: (gs) => {
          if (gs.gold < 60) return 'Not enough gold!';
          gs.gold -= 60;
          changeTilt(-10);
          return '-10 Tilt. Video deleted. For now.';
        }
      }
    ]
  }
];

// Ally encounters — friendly friends who help Costel
const ALLY_ENCOUNTERS = [
  {
    id: 'ally_generic',
    title: '🤝 A Friendly Face',
    art: '😊',
    description: 'One of your friends (a good one) jumps in the voice chat. "Bre, ești ok? Stai calm, e doar un joc."',
    choices: [
      {
        label: '🌬️ Chill Out',
        desc: 'Reduce Tilt by 20.',
        effect: (gs) => { changeTilt(-20); return '-20 Tilt. Feeling better.'; }
      },
      {
        label: '🃏 Get Advice',
        desc: 'Add a random Uncommon card to your deck.',
        effect: (gs) => {
          const pool = REWARD_POOL[R.UNCOMMON];
          const id = pool[Math.floor(Math.random() * pool.length)];
          gs.deck.push({ id, upgraded: false });
          return `Added: ${CARDS[id].name}`;
        }
      },
      {
        label: '✨ Get Hyped',
        desc: 'Upgrade a random card in your deck.',
        effect: (gs) => {
          const upgradeable = gs.deck.filter(c => !c.upgraded);
          if (!upgradeable.length) return 'All cards already upgraded!';
          const pick = upgradeable[Math.floor(Math.random() * upgradeable.length)];
          pick.upgraded = true;
          return `Upgraded: ${CARDS[pick.id].name}`;
        }
      }
    ]
  }
];

function getRandomEvent() {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}

function getAllyEncounter() {
  return ALLY_ENCOUNTERS[0];
}
