import type { BlankPhase, OperationFilter, RangeMax } from '../game/types';
import type { MemorySizeKey } from '../memory/types';
import type { CountingLevel } from '../counting/types';
import type { SequenceLevel } from '../sequence/types';
import type { MultiplyLevel } from '../multiply/types';
import type { CompareLevel } from '../compare/types';
import type { ClockLevel } from '../clock/types';
import type { SimonLevel } from '../simon/types';
import type { WordsLevel } from '../words/types';

export const strings = {
  appName: 'Játszótár',
  chooseGame: 'Mit játszunk?',
  countingTitle: 'Számlálás',
  sequenceTitle: 'Számsor',
  compareTitle: 'Kisebb-nagyobb',
  multiplyTitle: 'Szorzótábla',
  clockTitle: 'Óra',
  simonTitle: 'Színsor',
  wordsTitle: 'Szókirakó',
  memoryTitle: 'Memória párok',
  memorySizes: 'Méret',
  memorySizeLabel: (key: MemorySizeKey) => {
    if (key === 'easy') {
      return 'Könnyű · 3 pár';
    }
    if (key === 'medium') {
      return 'Közepes · 6 pár';
    }
    if (key === 'hard') {
      return 'Nehéz · 8 pár';
    }
    if (key === 'tricky') {
      return 'Hasonló · 8 pár';
    }
    return 'Órák · 8 pár';
  },
  memoryTrickyHint: 'Hasonló emojik',
  memoryClockHint: 'Hasonló órák',
  countingLevelLabel: (level: CountingLevel) => {
    if (level.layout === 'twocolour') {
      return 'Két szín';
    }
    if (level.layout === 'fives') {
      return `1–${level.max} · ötösök`;
    }
    return `${level.min}–${level.max}`;
  },
  countingFilterHint: (variant: 'red' | 'blue') =>
    variant === 'red' ? 'Hány piros?' : 'Hány kék?',
  sequenceLevelLabel: (level: SequenceLevel) => {
    if (level.display === 'expression') {
      return `Számolás · ${level.max}`;
    }
    if (level.display === 'mixed') {
      return `Vegyes · ${level.max}`;
    }
    if (level.stepRange.min >= 1) {
      return `+${level.stepRange.min}–+${level.stepRange.max} · ${level.max}`;
    }
    return `−${Math.abs(level.stepRange.min)}–+${level.stepRange.max} · ${level.max}`;
  },
  multiplyLevelLabel: (level: MultiplyLevel) => {
    if (level.table === 'mixed') {
      return level.blank === 'mixed' ? 'Vegyes · hiányzó' : 'Vegyes';
    }
    return `${level.table}× tábla`;
  },
  compareLevelLabel: (level: CompareLevel) => {
    if (level.includeSum) {
      return 'Összegek';
    }
    if (level.includeEmoji) {
      return `Emoji · 0–${level.max}`;
    }
    return `0–${level.max}`;
  },
  clockLevelLabel: (level: ClockLevel) => {
    if (level.answerMode === 'spoken') {
      return 'Magyarul';
    }
    if (level.minuteStep >= 60) {
      return 'Egész órák';
    }
    if (level.minuteStep === 30) {
      return 'Fél órák';
    }
    if (level.minuteStep === 15) {
      return 'Negyedek';
    }
    return '5 perces';
  },
  simonLevelLabel: (level: SimonLevel) => {
    const min = level.steps[0].length;
    const max = level.steps[level.steps.length - 1].length;
    return `${min}–${max} szín · lépésről lépésre`;
  },
  simonPrep: 'Készülj! Mindjárt jön a sorrend.',
  simonWatchOne: 'Figyeld: egy szín!',
  simonWatchMany: (count: number) => `Figyeld: ${count} szín sorrendben!`,
  simonYourTurn: 'Most te! Ismételd meg a sorrendet!',
  simonRetry: 'Figyeld újra!',
  simonBetweenRounds: 'Szép! Következő...',
  simonWin: 'Szuper!',
  simonProgress: (current: number, total: number) => `${current} / ${total}`,
  wordsLevelLabel: (level: WordsLevel) =>
    `${level.minGraphemes}–${level.maxGraphemes} betű`,
  wordsUndo: 'Vissza egy betű',
  pairsFound: (found: number, total: number) => `${found} / ${total} pár`,
  moves: (count: number) => `${count} lépés`,
  memoryWin: 'Megtaláltad az összeset!',
  hiddenCard: 'Lefordított kártya',
  title: 'Matek',
  start: 'Indul',
  addition: 'Összeadás',
  subtraction: 'Kivonás',
  mixed: 'Vegyes',
  clear: 'Töröl',
  submit: 'Kész',
  correct: 'Ügyes vagy!',
  wrong: 'Nem jó! Próbáld újra!',
  roundEnd: 'Szép munka!',
  replay: 'Újra',
  next: 'Következő',
  home: 'Vissza',
  nextPhase: 'Következő szint',
  nextRange: 'Következő tartomány',
  score: (correct: number, total: number) => `${correct} / ${total}`,
  progress: (current: number, total: number) => `${current} / ${total}`,
  rangeLabel: (max: RangeMax) => `0–${max}`,
  levels: 'Szintek',
  levelLabel: (max: RangeMax, phase: BlankPhase) =>
    `${strings.rangeLabel(max)} · ${strings.phaseLabel(phase)}`,
  phaseLabel: (phase: BlankPhase) => {
    if (phase === 1) {
      return 'Eredmény';
    }
    if (phase === 2) {
      return 'Hiányzó szám';
    }
    return 'Bármelyik hely';
  },
  operationLabel: (filter: OperationFilter) => {
    if (filter === 'add') {
      return strings.addition;
    }
    if (filter === 'subtract') {
      return strings.subtraction;
    }
    return strings.mixed;
  },
  unlocked: 'Nyitva',
  locked: 'Zárolva',
  soundShow: 'Hang be',
  soundHide: 'Hang ki',
  fullscreenEnter: 'Teljes képernyő',
  fullscreenExit: 'Kilépés',
  themeDark: 'Sötét mód',
  themeLight: 'Világos mód',
  retryStart: 'Most még egyszer a hibás feladatok!',
  retryProgress: (current: number, total: number) => `Ismét: ${current} / ${total}`,
  timerShow: 'Stopper be',
  timerHide: 'Stopper ki',
  elapsedTime: (text: string) => `Idő: ${text}`,
  bestTime: (text: string) => `Legjobb: ${text}`,
  newBestTime: 'Új rekord!',
  githubRepo: 'GitHub',
  footerCopyright: '© 2026 Laszlo Gecse',
  footerLicense: 'Apache License 2.0',
  footerLicenseSuffix: 'licenc alatt.',
};
