/* =========================================
   SH GROUP - MAIN SCRIPT
========================================= */


const components = {

    header:
        "components/header.html",

    home:
        "components/home/home.html",


    footer:
        "components/footer.html"

};


/* =========================================
   LOAD COMPONENT
========================================= */

async function loadComponent(
    name,
    path
) {

    const container =
        document.getElementById(name);


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                `${path} : ${response.status}`
            );

        }


        const html =
            await response.text();


        container.innerHTML =
            html;


        /* =====================================
           HOME JS
        ====================================== */

        if (name === "home") {

            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "components/home/home.js";


            script.onload = () => {

                loadHomeCards();

            };


            script.onerror = () => {

                console.error(
                    "home.js could not be loaded."
                );

            };


            document.body.appendChild(
                script
            );

        }


    } catch (error) {

        console.error(
            "Component loading error:",
            error
        );

    }

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Object.entries(
            components
        ).forEach(
            ([name, path]) => {

                loadComponent(
                    name,
                    path
                );

            }
        );

    }
);