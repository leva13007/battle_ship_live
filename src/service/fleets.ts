import type { ShipDefinition } from "../types";

export const JapanFleet: ShipDefinition[] = [
  { id: 1, name: "JS Yamato", size: 4, coordinates: [], hits: 0, isSunk: false },            // символічно, хоч і не на службі
  { id: 2, name: "JS Maya (DDG-179)", size: 3, coordinates: [], hits: 0, isSunk: false },    // есмінець
  { id: 3, name: "JS Atago (DDG-177)", size: 3, coordinates: [], hits: 0, isSunk: false },   // есмінець
  { id: 4, name: "JS Asahi (DD-119)", size: 2, coordinates: [], hits: 0, isSunk: false },    // есмінець
  { id: 5, name: "JS Akizuki (DD-115)", size: 2, coordinates: [], hits: 0, isSunk: false },  // есмінець
  { id: 6, name: "JS Ikazuchi (DE-107)", size: 2, coordinates: [], hits: 0, isSunk: false }, // ескорт
  { id: 7, name: "JS Shirasagi (PG-827)", size: 1, coordinates: [], hits: 0, isSunk: false }, // патруль
  { id: 8, name: "JS Kumataka (PG-827)", size: 1, coordinates: [], hits: 0, isSunk: false },  // патруль
  { id: 9, name: "JS Hayabusa (PG-824)", size: 1, coordinates: [], hits: 0, isSunk: false },  // патруль
  { id: 10, name: "JS Otaka (PG-826)", size: 1, coordinates: [], hits: 0, isSunk: false },    // патруль
];

export const UsaFleet: ShipDefinition[] = [
  { id: 1, name: "USS Iowa (BB-61)", size: 4, coordinates: [], hits: 0, isSunk: false },       // лінкор
  { id: 2, name: "USS Ticonderoga (CG-47)", size: 3, coordinates: [], hits: 0, isSunk: false }, // крейсер
  { id: 3, name: "USS Mobile Bay (CG-53)", size: 3, coordinates: [], hits: 0, isSunk: false },  // крейсер
  { id: 4, name: "USS Arleigh Burke (DDG-51)", size: 2, coordinates: [], hits: 0, isSunk: false }, // есмінець
  { id: 5, name: "USS Zumwalt (DDG-1000)", size: 2, coordinates: [], hits: 0, isSunk: false },    // футуристичний есмінець
  { id: 6, name: "USS Kidd (DDG-993)", size: 2, coordinates: [], hits: 0, isSunk: false },        // есмінець
  { id: 7, name: "USS Cyclone (PC-1)", size: 1, coordinates: [], hits: 0, isSunk: false },        // патруль
  { id: 8, name: "USS Firebolt (PC-10)", size: 1, coordinates: [], hits: 0, isSunk: false },      // патруль
  { id: 9, name: "USS Monsoon (PC-4)", size: 1, coordinates: [], hits: 0, isSunk: false },        // патруль
  { id: 10, name: "USS Hurricane (PC-3)", size: 1, coordinates: [], hits: 0, isSunk: false },     // патруль
];

export const UkraineFleet: ShipDefinition[] = [
  { id: 1, name: "Hetman Sahaidachnyi", size: 4, coordinates: [], hits: 0, isSunk: false }, // фрегат
  { id: 2, name: "U402 Lutsk", size: 3, coordinates: [], hits: 0, isSunk: false }, // корвет
  { id: 3, name: "U209 Ternopil", size: 3, coordinates: [], hits: 0, isSunk: false }, // корвет
  { id: 4, name: "U153 Pryluky", size: 2, coordinates: [], hits: 0, isSunk: false }, // ракетний катер
  { id: 5, name: "U500 Donbas", size: 2, coordinates: [], hits: 0, isSunk: false }, // судно забезпечення
  { id: 6, name: "U510 Korets", size: 2, coordinates: [], hits: 0, isSunk: false }, // буксир (реально дієвий)
  { id: 7, name: "U311 Cherkasy", size: 1, coordinates: [], hits: 0, isSunk: false }, // тральщик-легенда
  { id: 8, name: "U176 Nikopol", size: 1, coordinates: [], hits: 0, isSunk: false }, // арт. катер
  { id: 9, name: "U178 Berdyansk", size: 1, coordinates: [], hits: 0, isSunk: false }, // арт. катер
  { id: 10, name: "U179 Vyshhorod", size: 1, coordinates: [], hits: 0, isSunk: false }, // ще один броньований
];

export const UKFleet: ShipDefinition[] = [
  { id: 1, name: "HMS Vanguard", size: 4, coordinates: [], hits: 0, isSunk: false },          // підводний лінкор
  { id: 2, name: "HMS Belfast", size: 3, coordinates: [], hits: 0, isSunk: false },           // крейсер-музей
  { id: 3, name: "HMS Norfolk", size: 3, coordinates: [], hits: 0, isSunk: false },           // сучасний крейсер
  { id: 4, name: "HMS Daring (D32)", size: 2, coordinates: [], hits: 0, isSunk: false },      // есмінець типу 45
  { id: 5, name: "HMS Defender (D36)", size: 2, coordinates: [], hits: 0, isSunk: false },    // есмінець типу 45
  { id: 6, name: "HMS Diamond (D34)", size: 2, coordinates: [], hits: 0, isSunk: false },     // есмінець
  { id: 7, name: "HMS Trumpeter (P294)", size: 1, coordinates: [], hits: 0, isSunk: false },  // патруль
  { id: 8, name: "HMS Tracker (P274)", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 9, name: "HMS Dasher (P280)", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 10, name: "HMS Express (P163)", size: 1, coordinates: [], hits: 0, isSunk: false },
];

export const FranceFleet: ShipDefinition[] = [
  { id: 1, name: "FS Richelieu", size: 4, coordinates: [], hits: 0, isSunk: false },             // історичний лінкор
  { id: 2, name: "FS Forbin (D620)", size: 3, coordinates: [], hits: 0, isSunk: false },         // есмінець типу Horizon
  { id: 3, name: "FS Chevalier Paul (D621)", size: 3, coordinates: [], hits: 0, isSunk: false }, // есмінець Horizon
  { id: 4, name: "FS La Fayette (F710)", size: 2, coordinates: [], hits: 0, isSunk: false },     // фрегат
  { id: 5, name: "FS Courbet (F712)", size: 2, coordinates: [], hits: 0, isSunk: false },
  { id: 6, name: "FS Surcouf (F711)", size: 2, coordinates: [], hits: 0, isSunk: false },
  { id: 7, name: "FS Aramis", size: 1, coordinates: [], hits: 0, isSunk: false },                // патрульні судна
  { id: 8, name: "FS Flamant", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 9, name: "FS Cormoran", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 10, name: "FS Albatros", size: 1, coordinates: [], hits: 0, isSunk: false },
];

export const GermanyFleet: ShipDefinition[] = [
  { id: 1, name: "D187 Rommel", size: 4, coordinates: [], hits: 0, isSunk: false },                // есмінець
  { id: 2, name: "FGS Sachsen (F219)", size: 3, coordinates: [], hits: 0, isSunk: false },         // фрегат
  { id: 3, name: "FGS Hamburg (F220)", size: 3, coordinates: [], hits: 0, isSunk: false },         // фрегат
  { id: 4, name: "FGS Brandenburg (F215)", size: 2, coordinates: [], hits: 0, isSunk: false },     // фрегат
  { id: 5, name: "FGS Karlsruhe (F212)", size: 2, coordinates: [], hits: 0, isSunk: false },
  { id: 6, name: "FGS Emden (F210)", size: 2, coordinates: [], hits: 0, isSunk: false },
  { id: 7, name: "FGS Werra (A514)", size: 1, coordinates: [], hits: 0, isSunk: false },           // патруль/судно підтримки
  { id: 8, name: "FGS Rhein (A513)", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 9, name: "FGS Baltrum", size: 1, coordinates: [], hits: 0, isSunk: false },
  { id: 10, name: "FGS Helgoland", size: 1, coordinates: [], hits: 0, isSunk: false },
];