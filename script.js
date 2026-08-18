/* ==========================================
   STORAGE
========================================== */

const STORAGE_KEY = "d88_businesses";


/* ==========================================
   ANALYZE WEBSITE
========================================== */

function analyze() {

    const businessInput = document.getElementById("business");
    const websiteInput = document.getElementById("website");

    const businessName = businessInput.value.trim();
    const website = websiteInput.value.trim();

    if (businessName === "" || website === "") {

        alert("Please enter a business name and website URL.");

        return;
    }


    let score = 0;


    /* Missing features increase opportunity score */

    if (!document.getElementById("mobile").checked) {
        score += 20;
    }

    if (!document.getElementById("contact").checked) {
        score += 20;
    }

    if (!document.getElementById("cta").checked) {
        score += 20;
    }

    if (!document.getElementById("social").checked) {
        score += 10;
    }

    if (!document.getElementById("design").checked) {
        score += 30;
    }


    /* Determine priority */

    let priority;

    if (score >= 70) {

        priority = "High";

    } else if (score >= 40) {

        priority = "Medium";

    } else {

        priority = "Low";
    }


    /* Record testing time */

    const testedAt = new Date().toISOString();


    /* Create business */

    const business = {

        id: Date.now(),

        name: businessName,

        website: website,

        score: score,

        priority: priority,

        testedAt: testedAt
    };


    /* Get existing businesses */

    let businesses = getBusinesses();


    /* Add new business */

    businesses.push(business);


    /* Save */

    saveBusinesses(businesses);


    /* Show result */

    document.getElementById("result").innerHTML = `

        <h2>OPPORTUNITY SCORE: ${score}/100</h2>

        <h3>PRIORITY: ${priority.toUpperCase()}</h3>

        <p>
            ${businessName} has been saved to the database.
        </p>

        <p>
            <a href="businesses.html">
                VIEW ALL BUSINESSES →
            </a>
        </p>

    `;
}


/* ==========================================
   GET BUSINESSES
========================================== */

function getBusinesses() {

    const savedData = localStorage.getItem(STORAGE_KEY);


    if (!savedData) {

        return [];

    }


    try {

        const businesses = JSON.parse(savedData);

        if (Array.isArray(businesses)) {

            return businesses;

        }

    } catch (error) {

        console.error(
            "Could not read saved businesses:",
            error
        );

    }


    return [];
}


/* ==========================================
   SAVE BUSINESSES
========================================== */

function saveBusinesses(businesses) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(businesses)
    );
}


/* ==========================================
   DISPLAY BUSINESSES
========================================== */

function displayBusinesses() {

    const businessList =
        document.getElementById("businessList");


    /* Don't run on other pages */

    if (!businessList) {

        return;
    }


    let businesses = getBusinesses();


    const sortElement =
        document.getElementById("sort");


    const sortOption =
        sortElement ? sortElement.value : "priority";


    /* ======================================
       SORT BY PRIORITY
    ====================================== */

    if (sortOption === "priority") {

        const priorityValues = {

            High: 3,

            Medium: 2,

            Low: 1

        };


        businesses.sort(function(a, b) {

            return (
                priorityValues[b.priority] -
                priorityValues[a.priority]
            );

        });
    }


    /* ======================================
       SORT BY RECENT
    ====================================== */

    else if (sortOption === "recent") {

        businesses.sort(function(a, b) {

            return (
                new Date(b.testedAt) -
                new Date(a.testedAt)
            );

        });
    }


    /* ======================================
       NOTHING SAVED
    ====================================== */

    if (businesses.length === 0) {

        businessList.innerHTML = `

            <div class="business-card">

                <h2>NO BUSINESSES FOUND</h2>

                <p>
                    Test a website to add a business
                    to the database.
                </p>

            </div>

        `;

        return;
    }


    /* Clear old display */

    businessList.innerHTML = "";


    /* ======================================
       CREATE BUSINESS CARDS
    ====================================== */

    businesses.forEach(function(business) {


        const date =
            new Date(
                business.testedAt
            ).toLocaleString();


        const card =
            document.createElement("div");


        card.className =
            "business-card";


        card.innerHTML = `

            <h2>
                ${escapeHTML(business.name)}
            </h2>

            <p>
                <a
                    href="${escapeHTML(business.website)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(business.website)}
                </a>
            </p>

            <p>
                <strong>SCORE:</strong>
                ${business.score}/100
            </p>

            <p>
                <strong>PRIORITY:</strong>
                ${business.priority.toUpperCase()}
            </p>

            <p>
                <strong>TESTED:</strong>
                ${date}
            </p>

            <button
                class="delete-button"
                onclick="deleteBusiness(${business.id})"
            >
                DELETE
            </button>

        `;


        businessList.appendChild(card);

    });
}


/* ==========================================
   DELETE BUSINESS
========================================== */

function deleteBusiness(id) {

    let businesses = getBusinesses();


    businesses =
        businesses.filter(function(business) {

            return business.id !== id;

        });


    saveBusinesses(businesses);


    displayBusinesses();
}


/* ==========================================
   BASIC HTML ESCAPING
========================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* ==========================================
   LOAD DATABASE WHEN PAGE OPENS
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayBusinesses();

    }
);
