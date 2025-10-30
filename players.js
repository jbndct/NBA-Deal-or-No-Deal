// This file exports the expanded player database.
// Each position has 10 "value" tiers.
// For each round, the game will randomly pick ONE player from each tier
// to create the 10-player board for that round.

export const GAME_DATA = {
    "PG": {
        10: ["Luka Dončić", "Shai Gilgeous-Alexander"],
        9: ["Steph Curry", "Tyrese Haliburton", "Jalen Brunson"],
        8: ["Damian Lillard", "Trae Young", "De'Aaron Fox", "Ja Morant"],
        7: ["James Harden", "Darius Garland", "Kyrie Irving"],
        6: ["Cade Cunningham", "LaMelo Ball", "Tyrese Maxey"],
        5: ["CJ McCollum", "Jrue Holiday", "Mike Conley"],
        4: ["D'Angelo Russell", "Lonzo Ball", "Anfernee Simons"],
        3: ["Markelle Fultz", "Gabe Vincent", "Tre Jones"],
        2: ["Dennis Smith Jr.", "Monte Morris", "Davion Mitchell"],
        1: ["Killian Hayes", "Malachi Flynn", "Sharife Cooper"]
    },
    "SG": {
        10: ["Anthony Edwards", "Devin Booker"],
        9: ["Donovan Mitchell", "Derrick White", "Jalen Williams"],
        8: ["Jaylen Brown", "Paul George", "Desmond Bane"],
        7: ["Austin Reaves", "Tyler Herro", "Jordan Poole"],
        6: ["Klay Thompson", "Jalen Green", "Ben Mathurin"],
        5: ["Kevin Huerter", "Cam Thomas", "Gary Trent Jr."],
        4: ["Grayson Allen", "Alex Caruso", "Josh Giddey"],
        3: ["Luke Kennard", "Kentavious Caldwell-Pope", "Jalen Suggs"],
        2: ["Blake Wesley", "Quentin Grimes", "Ayo Dosunmu"],
        1: ["Bronny James", "Jaden Hardy", "Keon Johnson"]
    },
    "SF": {
        10: ["Jayson Tatum", "LeBron James", "Kawhi Leonard"],
        9: ["Jimmy Butler", "Brandon Ingram", "Mikal Bridges"],
        8: ["DeMar DeRozan", "Franz Wagner", "Scottie Barnes"],
        7: ["Brandon Miller", "RJ Barrett", "Trey Murphy III"],
        6: ["Andrew Wiggins", "Michael Porter Jr.", "Jaden McDaniels"],
        5: ["Deni Avdija", "Herb Jones", "Cam Johnson"],
        4: ["Josh Okogie", "Matisse Thybulle", "Corey Kispert"],
        3: ["Naji Marshall", "Ziaire Williams", "Julian Strawther"],
        2: ["Jae'Sean Tate", "Cedi Osman", "David Roddy"],
        1: ["Emoni Bates", "Max Christie", "Jake LaRavia"]
    },
    "PF": {
        10: ["Giannis Antetokounmpo", "Kevin Durant"],
        9: ["Zion Williamson", "Paolo Banchero", "Lauri Markkanen"],
        8: ["Pascal Siakam", "Jalen Johnson", "Evan Mobley"],
        7: ["Draymond Green", "Aaron Gordon", "Jabari Smith Jr."],
        6: ["Julius Randle", "Kyle Kuzma", "Keegan Murray"],
        5: ["Cooper Flagg", "Jerami Grant", "PJ Washington"],
        4: ["Patrick Williams", "Rui Hachimura", "Obi Toppin"],
        3: ["Kyle Filipowski", "Jae Crowder", "Robert Covington"],
        2: ["Tajan Salon", "Kenrich Williams", "Trendon Watford"],
        1: ["Aleksej Pokusevski", "Isaiah Stewart", "Dario Saric"]
    },
    "C": {
        10: ["Nikola Jokic", "Joel Embiid"],
        9: ["Victor Wembanyama", "Anthony Davis", "Chet Holmgren"],
        8: ["Bam Adebayo", "Domantas Sabonis", "Alperen Sengun"],
        7: ["Rudy Gobert", "Jarrett Allen", "Myles Turner"],
        6: ["Walker Kessler", "Kristaps Porzingis", "Brook Lopez"],
        5: ["Onyeka Okongwu", "Nic Claxton", "Jusuf Nurkic"],
        4: ["Zach Edey", "Mitchell Robinson", "Ivica Zubac"],
        3: ["Clint Capela", "Jonas Valanciunas", "Al Horford"],
        2: ["Tony Bradley", "Daniel Gafford", "Mason Plumlee"],
        1: ["Donovan Clingan", "Jalen Duren", "Isaiah Hartenstein"]
    }
};
