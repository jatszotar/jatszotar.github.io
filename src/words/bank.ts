export interface WordEntry {
  id: string;
  emoji: string;
  graphemes: string[];
}

const HUNGARIAN_DIGRAPHS = [
  'dzs',
  'dz',
  'cs',
  'gy',
  'ly',
  'ny',
  'sz',
  'ty',
  'zs',
] as const;

export function tokenizeHungarian(text: string): string[] {
  const graphemes: string[] = [];
  let index = 0;

  while (index < text.length) {
    const three = text.slice(index, index + 3);
    if (HUNGARIAN_DIGRAPHS.includes(three as (typeof HUNGARIAN_DIGRAPHS)[number])) {
      graphemes.push(three);
      index += 3;
      continue;
    }

    const two = text.slice(index, index + 2);
    if (HUNGARIAN_DIGRAPHS.includes(two as (typeof HUNGARIAN_DIGRAPHS)[number])) {
      graphemes.push(two);
      index += 2;
      continue;
    }

    graphemes.push(text[index]);
    index += 1;
  }

  return graphemes;
}

function word(id: string, emoji: string, text: string): WordEntry {
  return { id, emoji, graphemes: tokenizeHungarian(text) };
}

export const WORD_BANK: WordEntry[] = [
  word('alma', '🍎', 'alma'),
  word('kutya', '🐶', 'kutya'),
  word('macska', '🐱', 'macska'),
  word('haz', '🏠', 'ház'),
  word('nap', '☀️', 'nap'),
  word('hold', '🌙', 'hold'),
  word('hal', '🐟', 'hal'),
  word('labda', '⚽', 'labda'),
  word('virag', '🌸', 'virág'),
  word('fa', '🌳', 'fa'),
  word('auto', '🚗', 'autó'),
  word('vonat', '🚂', 'vonat'),
  word('lufi', '🎈', 'lufi'),
  word('eper', '🍓', 'eper'),
  word('banan', '🍌', 'banán'),
  word('medve', '🐻', 'medve'),
  word('nyuszi', '🐰', 'nyuszi'),
  word('beka', '🐸', 'béka'),
  word('meh', '🐝', 'méh'),
  word('pillango', '🦋', 'pillangó'),
  word('csillag', '⭐', 'csillag'),
  word('sziv', '❤️', 'szív'),
  word('szivarvany', '🌈', 'szivárvány'),
  word('madar', '🐦', 'madár'),
  word('kacsa', '🦆', 'kacsa'),
  word('tehen', '🐄', 'tehén'),
  word('lo', '🐴', 'ló'),
  word('kecske', '🐐', 'kecske'),
  word('diszno', '🐷', 'disznó'),
  word('boci', '🐮', 'boci'),
  word('roka', '🦊', 'róka'),
  word('farkas', '🐺', 'farkas'),
  word('oroszlan', '🦁', 'oroszlán'),
  word('tigris', '🐯', 'tigris'),
  word('zebra', '🦓', 'zebra'),
  word('zsiraf', '🦒', 'zsiráf'),
  word('elefant', '🐘', 'elefánt'),
  word('pingvin', '🐧', 'pingvin'),
  word('bagoly', '🦉', 'bagoly'),
  word('kigyo', '🐍', 'kígyó'),
  word('teknos', '🐢', 'teknős'),
  word('csiga', '🐌', 'csiga'),
  word('sun', '🦔', 'sün'),
  word('gyerek', '🧒', 'gyerek'),
  word('iskola', '🏫', 'iskola'),
  word('konyv', '📚', 'könyv'),
  word('ceruza', '✏️', 'ceruza'),
  word('toll', '🖊️', 'toll'),
  word('szek', '🪑', 'szék'),
  word('ajto', '🚪', 'ajtó'),
  word('ablak', '🪟', 'ablak'),
  word('kert', '🌳', 'kert'),
  word('szep', '✨', 'szép'),
  word('nagy', '📏', 'nagy'),
  word('kicsi', '🤏', 'kicsi'),
  word('meleg', '🌡️', 'meleg'),
  word('hideg', '❄️', 'hideg'),
  word('viz', '💧', 'víz'),
  word('tuz', '🔥', 'tűz'),
  word('fold', '🌍', 'föld'),
  word('kenguru', '🦘', 'kenguru'),
  word('papagaj', '🦜', 'papagáj'),
  word('hoember', '⛄', 'hóember'),
  word('jegkrem', '🍨', 'jégkrém'),
  word('zongora', '🎹', 'zongora'),
  word('szemuveg', '👓', 'szemüveg'),
  word('karacsony', '🎄', 'karácsony'),
  word('krokodil', '🐊', 'krokodil'),
  word('dinoszaurusz', '🦕', 'dinoszaurusz'),
  word('katicabogar', '🐞', 'katicabogár'),
  word('flamingo', '🦩', 'flamingó'),
  word('kukorica', '🌽', 'kukorica'),
  word('palacsinta', '🥞', 'palacsinta'),
  word('paradicsom', '🍅', 'paradicsom'),
  word('sargarepa', '🥕', 'sárgarépa'),
  word('csokolade', '🍫', 'csokoládé'),
  word('repulogep', '✈️', 'repülőgép'),
  word('helikopter', '🚁', 'helikopter'),
  word('kerekpar', '🚲', 'kerékpár'),
  word('villamos', '🚊', 'villamos'),
  word('mentoauto', '🚑', 'mentőautó'),
  word('tuzoltoauto', '🚒', 'tűzoltóautó'),
  word('napraforgo', '🌻', 'napraforgó'),
  word('jatszoter', '🛝', 'játszótér'),
  word('kosarlabda', '🏀', 'kosárlabda'),
  word('szamitogep', '💻', 'számítógép'),
  word('televizio', '📺', 'televízió'),
  word('szuletesnap', '🎂', 'születésnap'),
  word('hamburger', '🍔', 'hamburger'),
];

export function hasDigraph(entry: WordEntry): boolean {
  return entry.graphemes.some((grapheme) =>
    HUNGARIAN_DIGRAPHS.includes(grapheme as (typeof HUNGARIAN_DIGRAPHS)[number]),
  );
}

export function graphemeCount(entry: WordEntry): number {
  return entry.graphemes.length;
}

export function wordsForLevel(level: {
  minGraphemes: number;
  maxGraphemes: number;
  allowDigraphs: boolean;
}): WordEntry[] {
  return WORD_BANK.filter((entry) => {
    const count = graphemeCount(entry);
    if (count < level.minGraphemes || count > level.maxGraphemes) {
      return false;
    }
    if (!level.allowDigraphs && hasDigraph(entry)) {
      return false;
    }
    return true;
  });
}
