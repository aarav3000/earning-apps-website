/* ==========================================
   EARNHUB — WEBSITE FUNCTIONALITY
========================================== */


/*
   ==========================================
   APP DATA
   ==========================================

   Abhi ye DEMO apps hain.

   Baad me isi data ko ADMIN PANEL + DATABASE
   se automatically load karenge.

   Har app me:
   - name
   - logo
   - details
   - referral link
   - featured
*/

const apps = [

  {
    name: "Sample Earning App",
    logo: "E",
    details: [
      "Referral Rewards",
      "Easy Signup"
    ],
    url: "#",
    featured: true
  },

  {
    name: "Sample Rewards App",
    logo: "R",
    details: [
      "Tasks & Rewards",
      "Offers Available"
    ],
    url: "#",
    featured: true
  },

  {
    name: "Sample Finance App",
    logo: "F",
    details: [
      "Rewards",
      "Terms Apply"
    ],
    url: "#",
    featured: false
  },

  {
    name: "Sample Bonus App",
    logo: "B",
    details: [
      "Referral Bonus",
      "Check Eligibility"
    ],
    url: "#",
    featured: false
  }

];


/*
   ==========================================
   FAQ DATA
==========================================
*/

const faqs = [

  {
    question: "How do I join an app?",
    answer:
      "Choose an app from the list, check its details and tap the Join Now button. You will be redirected through the referral link provided for that app."
  },

  {
    question: "Are earnings guaranteed?",
    answer:
      "No. Rewards, eligibility, approvals and withdrawals depend on the individual app and its current rules. We do not guarantee earnings."
  },

  {
    question: "Can app details change?",
    answer:
      "Yes. Offers, rewards and conditions can change at any time. Always check the individual app's latest terms before participating."
  },

  {
    question: "Where can I get new app updates?",
    answer:
      "Join our Telegram channel using the Join Telegram button on the website to receive new listings and important updates."
  },

  {
    question: "Do I need to pay to join every app?",
    answer:
      "Not necessarily. Each app has its own rules and requirements. Always check the official terms before making any payment or completing an offer."
  }

];


/*
   ==========================================
   ELEMENTS
==========================================
*/

const appList =
  document.getElementById("app-list");

const searchInput =
  document.getElementById("search");

const appCount =
  document.getElementById("app-count");

const faqList =
  document.getElementById("faq-list");


/*
   ==========================================
   CREATE APP CARD
==========================================
*/

function createAppCard(app) {

  const card =
    document.createElement("article");

  card.className = "app-card";


  /*
     Logo
  */

  const logo =
    document.createElement("div");

  logo.className = "logo";

  logo.textContent =
    app.logo || "A";


  /*
     App information
  */

  const information =
    document.createElement("div");


  const name =
    document.createElement("div");

  name.className = "app-name";

  name.textContent =
    app.name;


  /*
     Details
  */

  const details =
    document.createElement("div");

  details.className = "details";


  if (
    Array.isArray(app.details) &&
    app.details.length > 0
  ) {

    app.details.forEach(detail => {

      const tag =
        document.createElement("span");

      tag.className = "tag";

      tag.textContent =
        detail;

      details.appendChild(tag);

    });

  }


  information.appendChild(name);

  information.appendChild(details);


  /*
     Join button
  */

  const join =
    document.createElement("a");

  join.className = "join";

  join.textContent =
    "Join Now ↗";

  join.href =
    app.url || "#";

  join.target =
    "_blank";

  join.rel =
    "noopener noreferrer";


  /*
     Card assemble
  */

  card.appendChild(logo);

  card.appendChild(information);

  card.appendChild(join);


  return card;
}


/*
   ==========================================
   DISPLAY APPS
==========================================
*/

function displayApps(list) {

  appList.innerHTML = "";


  /*
     Update app count
  */

  appCount.textContent =
    `${list.length} App${list.length === 1 ? "" : "s"}`;


  /*
     No result
  */

  if (list.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "step-card";

    empty.innerHTML = `
      <h3>No apps found</h3>
      <p>
        Try searching with another app name.
      </p>
    `;

    appList.appendChild(empty);

    return;
  }


  /*
     Add cards
  */

  list.forEach(app => {

    const card =
      createAppCard(app);

    appList.appendChild(card);

  });

}


/*
   ==========================================
   INITIAL APP LOAD
==========================================
*/

displayApps(apps);


/*
   ==========================================
   SEARCH
==========================================
*/

searchInput.addEventListener(
  "input",
  function () {

    const query =
      this.value
        .trim()
        .toLowerCase();


    const filteredApps =
      apps.filter(app => {

        const appName =
          app.name.toLowerCase();


        const details =
          Array.isArray(app.details)
            ? app.details.join(" ").toLowerCase()
            : "";


        return (
          appName.includes(query) ||
          details.includes(query)
        );

      });


    displayApps(filteredApps);

  }
);


/*
   ==========================================
   FAQ
==========================================
*/

function createFAQ() {

  faqList.innerHTML = "";


  faqs.forEach((faq, index) => {

    const item =
      document.createElement("div");

    item.className =
      "faq-item";


    /*
       Question button
    */

    const question =
      document.createElement("button");

    question.className =
      "faq-question";

    question.type =
      "button";


    question.innerHTML = `
      <span>${faq.question}</span>
      <span class="faq-plus">+</span>
    `;


    /*
       Answer
    */

    const answer =
      document.createElement("div");

    answer.className =
      "faq-answer";

    answer.textContent =
      faq.answer;


    /*
       Click event
    */

    question.addEventListener(
      "click",
      function () {

        /*
           Close other FAQ items
           so only one stays open.
        */

        document
          .querySelectorAll(".faq-item")
          .forEach(otherItem => {

            if (otherItem !== item) {

              otherItem.classList.remove(
                "active"
              );

            }

          });


        /*
           Toggle current item
        */

        item.classList.toggle(
          "active"
        );

      }
    );


    item.appendChild(question);

    item.appendChild(answer);

    faqList.appendChild(item);

  });

}


/*
   ==========================================
   INITIAL FAQ LOAD
==========================================
*/

createFAQ();


/*
   ==========================================
   SMOOTH ANCHOR LINKS
==========================================
*/

document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener(
      "click",
      function (event) {

        const targetId =
          this.getAttribute("href");


        if (
          targetId &&
          targetId !== "#"
        ) {

          const target =
            document.querySelector(
              targetId
            );


          if (target) {

            event.preventDefault();


            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }

      }
    );

  });


/*
   ==========================================
   BUTTON CLICK FEEDBACK
==========================================
*/

document.addEventListener(
  "click",
  function (event) {

    const button =
      event.target.closest(".join");


    if (!button) return;


    /*
       Demo links currently use "#".
       Real referral links will come
       from the admin panel later.
    */

    if (button.getAttribute("href") === "#") {

      event.preventDefault();

      alert(
        "This is a demo app. The real referral link will be added from the admin panel."
      );

    }

  }
);


/*
   ==========================================
   PAGE READY
==========================================
*/

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "EarnHub website loaded successfully."
    );

  }
);
