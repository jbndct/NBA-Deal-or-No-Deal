# 🏀 NBA Deal or No Deal - A Web Game 💰

> 🏀 A "Deal or No Deal" style web game to build your dream NBA starting five. Will you risk it all or take the banker's offer? 💰 Inspired by Enjoy BBall.

This is a web-based game that simulates the "Deal or No Deal" concept, tasking you with building a championship-caliber NBA starting five. Can you take the risk to get a superstar, or will you play it safe and take the banker's offer?

This project was inspired by the video [**"Can We Build a Championship Team?? NBA DEAL OR NO DEAL"**](https://www.youtube.com/watch?v=jlpr0-YBnNw) by the **Enjoy BBall** YouTube channel.

## ✨ Features

  * 🏀 **Build Your Team:** Draft a full starting five, one position at a time (PG, SG, SF, PF, C).
  * 💼 **Deal or No Deal Logic:** Choose a case, eliminate others, and receive offers from the "Banker" to accept a player or risk what's in your case.
  * 🔁 **High Replayability:** The 10-player board for each round is randomly generated from a large pool of over 30 players per position, ensuring every game is different.
  * 🤖 **Dynamic Banker AI:** The banker's offers are calculated based on the average value of the players still on the board.
  * 📁 **Modular Code:** The project is broken down into clean, separate files for data (`players.js`), logic (`script.js`), structure (`index.html`), and styling (`style.css`).

## 🎮 How to Play

1.  The game will start with the **Point Guard** position.
2.  👆 **Pick Your Case:** Click on one of the 10 cases to hold as your own.
3.  ❌ **Eliminate Cases:** Follow the on-screen prompts to open a certain number of other cases. As you do, the players in those cases will be revealed and eliminated from the board.
4.  📞 **Receive an Offer:** After each round of eliminations, the "Banker" will make you an offer.
      * ✅ **DEAL:** Accept the banker's player. This player will be added to your roster, and you will move to the next position.
      * 🚫 **NO DEAL:** Reject the offer and continue eliminating cases to see what you can get.
5.  If you reject all offers, you will be left with your original case and one other. You will receive a final offer. If you "No Deal" again, you will get the player hidden in the case you first picked.
6.  Repeat the process for all 5 positions to build your final team\! 🏆

## 💻 How to Run Locally

Since this project is built with client-side HTML, CSS, and modular JavaScript, you just need a modern web browser.

1.  Clone this repository or download all four files (`index.html`, `style.css`, `script.js`, `players.js`) into a single folder.
2.  Open the `index.html` file in your web browser.
3.  The game will start automatically. 🚀

## 🙏 Acknowledgements

  * 📺 **Original Concept:** [Enjoy BBall on YouTube](https://www.google.com/search?q=https://www.youtube.com/%40EnjoyBBall)
  * ▶️ **Inspiration Video:** [Can We Build a Championship Team?? NBA DEAL OR NO DEAL](https://www.youtube.com/watch?v=jlpr0-YBnNw)
