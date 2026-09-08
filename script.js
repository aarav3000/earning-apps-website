/*
   ==========================================
   EARNHUB — WEBSITE FUNCTIONALITY
   ==========================================
*/

const SUPABASE_URL =
  "https://vjwixiaigfhxvlohjgoq.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_-Efo0V_EiJ0kk56OZq_NhQ_1E68yyK1";


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
   DATABASE APP DATA
   ==========================================
*/

let apps = [];


/*
   ==========================================
   LOAD APPS FROM SUPABASE
   ==========================================
*/

async function loadApps() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/apps?select=*&status=eq.active&order=created_at.desc`,
      {
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );


    if (!response.ok) {

      throw new Error(
        `Database error: ${response.status}`
      );

    }


    const data =
      await response.json();


    apps = data.map(app => {

      let details = [];

      if (app.description) {

        details =
          app.description
            .split(/\n|,/)
            .map(item => item.trim())
            .filter(Boolean)
            .slice(0, 4);

      }


      return {

        id: app.id,

        name: app.name || "Unnamed App",

        logo: app.logo_url || "",

        details: details,

        url: app.referral_url || "#",

        featured: app.featured === true

      };

    });


    displayApps(apps);

    displayFeaturedApps(apps);


    console.log(
      `EarnHub: ${apps.length} apps loaded from database.`
    );


  } catch (error) {

    console.error(
      "Supabase error:",
      error
    );


    apps = [];


    appList.innerHTML = `
      <div class="step-card">
        <h3>Apps are temporarily unavailable</h3>
        <p>
          Please try again in a moment.
        </p>
      </div>
    `;


    if (appCount) {
      appCount.textContent = "0 Apps";
    }

  }

}


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


  if (app.logo) {

    const image =
      document.createElement("img");

    image.src =
      app.logo;

    image.alt =
      `${app.name} Logo`;

    image.loading =
      "lazy";

    image.onerror =
      function () {

        image.remove();

        logo.textContent =
          (app.name || "A")
            .charAt(0)
            .toUpperCase();

      };

    logo.appendChild(image);

  } else {

    logo.textContent =
      (app.name || "A")
        .charAt(0)
        .toUpperCase();

  }


  /*
     App information
  */

  const information =
    document.createElement("div");


  const name =
    document.createElement("div");

  name.className =
    "app-name";

  name.textContent =
    app.name;


  /*
     Details
  */

  const details =
    document.createElement("div");

  details.className =
    "details";


  if (
    Array.isArray(app.details) &&
    app.details.length > 0
  ) {

    app.details.forEach(detail => {

      const tag =
        document.createElement("span");

      tag.className =
        "tag";

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

  join.className =
    "join";

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
   DISPLAY ALL APPS
   ==========================================
*/

function displayApps(list) {

  if (!appList) return;


  appList.innerHTML = "";


  if (appCount) {

    appCount.textContent =
      `${list.length} App${list.length === 1 ? "" : "s"}`;

  }


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


  list.forEach(app => {

    const card =
      createAppCard(app);

    appList.appendChild(card);

  });

}


/*
   ==========================================
   FEATURED APPS
   ==========================================
*/

function displayFeaturedApps(list) {

  const featuredContainer =
    document.getElementById("featured-apps");

  if (!featuredContainer) return;


  featuredContainer.innerHTML = "";


  const featuredApps =
    list.filter(app => app.featured);


  featuredApps.forEach(app => {

    const card =
      createAppCard(app);

    featuredContainer.appendChild(card);

  });

}


/*
   ==========================================
   SEARCH
   ==========================================
*/

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();

    const filteredApps = apps.filter(app => {
      const appName = String(app.name || "").toLowerCase();

      const details = Array.isArray(app.details)
        ? app.details.join(" ").toLowerCase()
        : String(app.details || "").toLowerCase();

      return (
        query === "" ||
        appName.includes(query) ||
        details.includes(query)
      );
    });

    displayApps(filteredApps);
  });
}


/*
   ==========================================
   FAQ
   ==========================================
*/

function createFAQ() {

  if (!faqList) return;


  faqList.innerHTML = "";


  faqs.forEach(faq => {

    const item =
      document.createElement("div");

    item.className =
      "faq-item";


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


    const answer =
      document.createElement("div");

    answer.className =
      "faq-answer";

    answer.textContent =
      faq.answer;


    question.addEventListener(
      "click",
      function () {

        document
          .querySelectorAll(".faq-item")
          .forEach(otherItem => {

            if (otherItem !== item) {

              otherItem.classList.remove(
                "active"
              );

            }

          });


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
   PAGE START
   ==========================================
*/

createFAQ();

loadApps();


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
