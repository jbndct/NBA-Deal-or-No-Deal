// --- NBA Deal or No Deal Player Database ---
// This file contains the expanded player pool for the game.
// Data is based on 2025-2026 NBA season rankings and projections.
// The game randomly picks ONE player from each tier (10 down to 1)
// to build the 10-player board for each round.

export const GAME_DATA = {
    "PG": {
        10: ["Shai Gilgeous-Alexander", "Luka Dončić (LAL)"],
        9: ["Jalen Brunson", "Tyrese Haliburton", "Stephen Curry"],
        8: ["Anthony Edwards", "Tyrese Maxey", "Trae Young", "Cade Cunningham"],
        7: ["Ja Morant", "De'Aaron Fox (SAN)", "Jamal Murray", "LaMelo Ball", "Donovan Mitchell"],
        6: ["Darius Garland", "Coby White", "Amen Thompson (HOU)"],
        5: ["Jrue Holiday (POR)", "Derrick White", "Mike Conley", "Anfernee Simons (BOS)"],
        4: ["CJ McCollum (WAS)", "Austin Reaves (LAL)", "Josh Giddey (CHI)", "Immanuel Quickley"],
        3: ["Jalen Suggs", "Tre Jones", "Markelle Fultz", "Scoot Henderson"],
        2: ["T.J. McConnell", "Davion Mitchell", "Ayo Dosunmu", "Monte Morris"],
        1: ["Isaiah Collier (UTA)", "Bub Carrington (WAS)", "Dylan Harper (SAN)", "Malachi Flynn"]
    },
    "SG": {
        10: ["Devin Booker", "Anthony Edwards"], // Edwards is PG/SG, Booker is PG/SG
        9: ["Jalen Williams (OKC)", "Donovan Mitchell"],
        8: ["Jaylen Brown", "Tyler Herro", "Desmond Bane (ORL)"],
        7: ["Jalen Green (PHO)", "Jordan Poole (NOR)", "Austin Reaves (LAL)", "Zach LaVine (SAC)"],
        6: ["Ben Mathurin", "Cam Thomas", "Dyson Daniels (ATL)", "Bogdan Bogdanović"],
        5: ["Alex Caruso (OKC)", "Gary Trent Jr. (MIL)", "Klay Thompson (DAL)", "Norman Powell (MIA)"],
        4: ["Brandin Podziemski", "Quentin Grimes (PHI)", "Lu Dort", "Herb Jones (NOR)"],
        3: ["Christian Braun", "Matisse Thybulle (POR)", "Jaden Ivey", "Shaedon Sharpe"],
        2: ["Stephon Castle (SAN)", "Ayo Dosunmu (CHI)", "Blake Wesley", "Keyonte George (UTA)"],
        1: ["VJ Edgecombe (PHI)", "Kon Knueppel (CHA)", "Jaden Hardy", "Cam Whitmore (WAS)"]
    },
    "SF": {
        10: ["Jayson Tatum"], // Tatum is often PF, but a primary wing
        9: ["Kawhi Leonard", "Jalen Williams (OKC)"],
        8: ["LeBron James (LAL)", "Paul George (PHI)", "Mikal Bridges (NYK)", "Jimmy Butler (GSW)"],
        7: ["Franz Wagner", "Brandon Miller", "Scottie Barnes", "Trey Murphy III"],
        6: ["DeMar DeRozan (SAC)", "Michael Porter Jr. (BKN)", "Jaden McDaniels", "RJ Barrett"],
        5: ["Cam Johnson (DEN)", "Aaron Nesmith", "OG Anunoby (NYK)", "Deni Avdija (POR)"],
        4: ["Josh Hart (NYK)", "Ausar Thompson", "Tari Eason", "Andrew Wiggins (MIA)"],
        3: ["Cooper Flagg (DAL)", "Matas Buzelis (CHI)", "Zaccharie Risacher (ATL)", "Bilal Coulibaly"],
        2: ["Ziaire Williams", "Julian Strawther", "Jae'Sean Tate", "Max Strus"],
        1: ["Dillon Brooks (PHO)", "Jalen Wells (MEM)", "Corey Kispert", "Naji Marshall"]
    },
    "PF": {
        10: ["Giannis Antetokounmpo", "Nikola Jokic"], // Jokic is C, but top tier
        9: ["Kevin Durant (HOU)", "Anthony Davis (DAL)"],
        8: ["Victor Wembanyama", "Zion Williamson", "Paolo Banchero", "Lauri Markkanen"],
        7: ["Pascal Siakam", "Evan Mobley", "Chet Holmgren", "Jaren Jackson Jr."],
        6: ["Julius Randle (MIN)", "Domantas Sabonis", "Scottie Barnes", "Jalen Johnson"],
        5: ["Aaron Gordon", "Jabari Smith Jr.", "Keegan Murray", "Kyle Kuzma (MIL)"],
        4: ["Draymond Green (GSW)", "PJ Washington", "Rui Hachimura", "Tobias Harris (DET)"],
        3: ["John Collins (LAC)", "Cooper Flagg (DAL)", "Obi Toppin", "Patrick Williams"],
        2: ["Bobby Portis", "Jae Crowder", "Robert Covington", "Kenrich Williams"],
        1: ["Aleksej Pokusevski", "Dario Saric", "Tajan Salon", "Kyle Filipowski (UTA)"]
    },
    "C": {
        10: ["Nikola Jokic", "Victor Wembanyama"],
        9: ["Joel Embiid", "Anthony Davis (DAL)", "Karl-Anthony Towns (NYK)"],
        8: ["Chet Holmgren", "Domantas Sabonis", "Bam Adebayo", "Alperen Sengun"],
        7: ["Rudy Gobert", "Myles Turner (MIL)", "Jarrett Allen", "Kristaps Porziņģis (ATL)"],
        6: ["Walker Kessler", "Nic Claxton (BKN)", "Ivica Zubac (LAC)", "Brook Lopez"],
        5: ["Jalen Duren", "Dereck Lively II", "Onyeka Okongwu", "Isaiah Hartenstein (OKC)"],
        4: ["Deandre Ayton (LAL)", "Mark Williams (PHO)", "Mitchell Robinson", "Daniel Gafford (DAL)"],
        3: ["Clint Capela", "Jonas Valanciunas", "Al Horford", "Zach Edey (MEM)"],
        2: ["Alex Sarr (WAS)", "Donovan Clingan (POR)", "Jalen Duren", "Mason Plumlee"],
        1: ["Kel'el Ware (MIA)", "Yves Missi (NOR)", "Neemias Queta", "Tony Bradley"]
    }
};

